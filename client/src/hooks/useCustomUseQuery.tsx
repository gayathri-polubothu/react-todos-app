import { useEffect, useRef} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const LOCAL_STORAGE_CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 23 // 23h
const divider = '---$---'
const defaultOptions = {
    persist: true, // set to false not to cache stuff in localStorage
    useLocation: true, // this will add the current location pathname to the component, to make the query keys more specific. disable if the same component is used on different pages and needs the same data
    persistFor: LOCAL_STORAGE_CACHE_EXPIRY_TIME,
    invalidateAfterMidnight: false, // probably you want this to be true for charts where the dates are visible. will overwrite persistFor, setting expiry time to today midnight
    defaultTo: {},
    withRealCustomerId: false,
    withGlobalUserId: true,
    retry: false // don't retry failed queries
}

const getLocalStorageCache = (dataId: string, invalidateAfterMidnight: any) => {
    const data = localStorage.getItem(dataId)
    if (!data) {
        return
    }
    try {
        const parsedData = JSON.parse(data)
        const today = new Date()
        const expiryDate = new Date(Number(parsedData.expiryTime))
        const expired =
            today.getTime() - LOCAL_STORAGE_CACHE_EXPIRY_TIME >= expiryDate.getTime() ||
            (invalidateAfterMidnight && today !== expiryDate)

        if (expired || !parsedData?.data) {
            // don't bother removing the item from localStorage, since it will be saved again with the new expiry time and date when the component is unmounted or the user leaves the page
            return
        }

        return parsedData.data
    } catch (e) {
        console.log(`unable to parse local storage cache for ${dataId}`)
        return undefined
    }
}

const saveToLocalStorage = (data: any, dataId: string) => {
    try {
        const wrapper = JSON.stringify({
            expiryTime: new Date().getTime() + LOCAL_STORAGE_CACHE_EXPIRY_TIME,
            data
        })
        localStorage.setItem(dataId, wrapper)
    } catch (e) {
        console.log(
            `Unable to save data in localStorage for ${dataId}. Most probably there is a function in the payload, and JSON.stringify failed, or data is too big`,
            data,
            e
        )
    }
}
const useCustomUseQuery = (queryKeys:[string], getData: Function, queryOptions: any) => {
    const options = { ...defaultOptions, ...queryOptions }
    const queryClient = useQueryClient()
    const queryKey = Array.isArray(queryKeys) ? queryKeys : [queryKeys]

    if (options.useLocation) {
        if (typeof queryKey[0] === 'string') {
            queryKey[0] = `${queryKey[0]}--path--${window.location.pathname}`
        } else {
            try {
                queryKey[0] = `${JSON.stringify(queryKey[0])}${window.location.pathname}`
            } catch (e) {
                console.error(
                    'Unable to make query. Make sure you provide a string or array with first item string to useQuery',
                    e
                )
            }
        }
    }
    const queryId = `${queryKey.slice(0, queryKey.length).join()}${divider}`

    const placeholderData = useRef(
        options.persist
            ? getLocalStorageCache(queryId, options.invalidateAfterMidnight) ||
            options.placeholderData
            : options.placeholderData
    )
    const useCallback = useRef<{ current: Boolean } | Boolean>(false)
    const afterInvalidationCallback = useRef<any>(null)
    const showRefetch = useRef<{ current: Boolean } | Boolean>(false)
    const onSuccess = (freshData: any) => {
        placeholderData.current = undefined
        showRefetch.current = false
        if (options.onSuccess) {
            options.onSuccess(freshData)
        }
        if (useCallback.current && afterInvalidationCallback.current) {
            afterInvalidationCallback.current(freshData)
            useCallback.current = false
            afterInvalidationCallback.current = null
        }

        if (options.persist) {
            saveToLocalStorage(freshData, queryId)
        }
    }
    const data = useQuery({queryKey: [queryId], queryFn: getData,
        ...options,
        placeholderData: placeholderData.current,
        onSuccess,
        enabled:options?.enabled || true
    })

    useEffect(() => {
        const save = () => {
            if (options.persist && data?.data) {
                saveToLocalStorage(data.data, queryId)
            }
        }
        return save
    }, [])

    const invalidateQuery = (callBack: any) => {
        if (callBack && typeof callBack === 'function') {
            useCallback.current = true
            afterInvalidationCallback.current = callBack
        } else if (callBack) {
            console.error(
                'Non function provided to invalidateQuery. Make sure you provide a function or a falsy value, such as undefined, null, false or 0'
            )
        }
        showRefetch.current = true
        queryClient.invalidateQueries({queryKey:[queryId]})
    }

    const updateQuery = (callBackOrNewValue: any) => {
        let newData = callBackOrNewValue
        if (typeof newData === 'function') {
            newData = callBackOrNewValue(data.data)
        }
        queryClient.setQueryData(queryKey, newData)
    }

    return {
        ...data,
        queryKey,
        invalidateQuery,
        data: data.data ?? options.placeholderData ?? options.defaultTo,
        updateQuery,
        queryClient,
        isFetchingAfterCacheDataWasReturned:
            data.isFetching &&
            !placeholderData.current &&
            !data.isLoading &&
            showRefetch.current === true
    }
}

export default useCustomUseQuery