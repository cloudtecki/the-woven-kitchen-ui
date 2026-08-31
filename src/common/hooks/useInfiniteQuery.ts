
import { RefObject, useCallback, useEffect, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'core/base/const';
import { ProductListItem, ProductParams, SortParams } from 'core/base/type';
import { useLazyGetProductQuery } from 'core/api/product/queries';
import useScroll from './useScroll';

const useInfiniteQuery = (
    scrollContainerRef: RefObject<HTMLElement | null>,
    sortParams: SortParams,
) => {
    const [localOffset, setLocalOffset] = useState<number>(DEFAULT_OFFSET);
    const [combinedData, setCombinedData] = useState<ProductListItem[]>([]);
    // const removedFavItemsCountRef = useRef<Set<string>>(new Set());

    const [trigger, queryResponse] = useLazyGetProductQuery();

    const { isError, isFetching, isLoading, isSuccess, error } = queryResponse;

    // const totalCount = queryResponse.data?.length || INITIAL_TOTAL_COUNT;
    const totalCount = 138; // Hardcoded for testing purpose

    const [hasScrolledToEnd, resetScrollEnd] = useScroll({
        container: scrollContainerRef,
    });

    const getData = useCallback(
        async (params: ProductParams) => {
            const payload = { ...params };
            trigger(payload);
        },
        [trigger],
    );

    useEffect(() => {
        if (
            queryResponse?.isSuccess &&
            !queryResponse?.isFetching &&
            !queryResponse?.isLoading &&
            queryResponse?.data
        ) {
            const items = queryResponse.data;
            if (items && items.length > 0) {
                setCombinedData((prevData) => {
                    // Prevent duplicate items by checking if they already exist
                    const existingIds = new Set(prevData.map((item) => item.id));
                    const newItems = items.filter((item) => !existingIds.has(item.id));
                    return [...prevData, ...newItems];
                });
            }
        }
    }, [queryResponse]);

    useEffect(() => {
        // Only trigger next API call if not currently fetching and scroll has ended
        if (hasScrolledToEnd && !isFetching && !isLoading) {
            getNext?.();
            resetScrollEnd?.();
            // removedFavItemsCountRef.current.clear();
        }
    }, [hasScrolledToEnd, isFetching, isLoading]);

    useEffect(() => {
        const offset = DEFAULT_OFFSET;
        const limit = DEFAULT_LIMIT;
        getData({
            limit,
            offset,
            // filter: listParams,
            // sortBy: sortParams.sortBy,
            // sortDirection: sortParams.sortDirection,
        });
        setCombinedData([]);
        setLocalOffset(offset);
        resetScrollEnd?.();
        // removedFavItemsCountRef.current.clear();
        //when filter changes, rest scroll to top
        if (scrollContainerRef?.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, []);

    const getNext = async () => {
        const nextOffset = localOffset + DEFAULT_LIMIT;
        // if (listParams.isFavourite == true) {
        //     nextOffset =
        //         localOffset + DEFAULT_LIMIT - removedFavItemsCountRef.current.size;
        // }

        if (nextOffset < totalCount) {
            getData({
                offset: nextOffset,
                limit: DEFAULT_LIMIT,
                // filter: { ...listParams },
                sortBy: sortParams.sortBy,
                sortDirection: sortParams.sortDirection,
            });
            setLocalOffset(nextOffset);
        }
    };

    const updateData = useCallback(
        (updateFn: (currentData: ProductListItem[]) => ProductListItem[]) => {
            setCombinedData(updateFn);
        },
        [],
    );

    const removeFromFavList = useCallback((itemId: number) => {
        setCombinedData((prevData) => {
            const filteredData = prevData.filter((item) => item.id !== itemId);
            // if (filteredData.length !== prevData.length) {
            //     removedFavItemsCountRef.current.add(String(itemId));
            // }
            return filteredData;
        });
    }, []);

    const reset = () => {
        setLocalOffset(DEFAULT_OFFSET);
        setCombinedData([]);
        //  removedFavItemsCountRef.current.clear();
    };

    return {
        data: combinedData,
        totalCount,
        getNext,
        reset,
        updateData,
        removeFromFavList,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
    };
};

export default useInfiniteQuery;