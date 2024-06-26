import { PageType, SortOption } from '@/app/_types/review.type'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { reviewKeys } from '..'
import { useClientCookies } from '../../../common/useClientCookies'

interface ReviewQueryParams {
  pageParam: string | null
  itemId: number
  sortOption: SortOption
  accessToken: string
}

const INITIAL_SIZE = 3
const REVIEW_FETCH_SIZE = 10

async function fetchReviewList({
  pageParam,
  itemId,
  sortOption,
  accessToken,
}: ReviewQueryParams) {
  /** 기본 3개 - 추가 10개 */
  const REVIEW_DATA_SIZE = !pageParam ? INITIAL_SIZE : REVIEW_FETCH_SIZE

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews?itemId=${itemId}&size=${REVIEW_DATA_SIZE}&cursorId=${pageParam}&reviewSortCondition=${sortOption}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    },
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message)
  }

  return data
}

export const useSearchItemQuery = (itemId: number, sortOption: SortOption) => {
  const { getClientCookie } = useClientCookies()
  const accessToken = getClientCookie('accessToken')

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: reviewKeys.reviewList(itemId, sortOption).queryKey,
      queryFn: ({ pageParam = null }) =>
        fetchReviewList({ pageParam, itemId, sortOption, accessToken }),
      initialPageParam: null,
      getNextPageParam: (lastPage: PageType, allPages: PageType[]) => {
        const allReviewsLoaded = allPages.flatMap((page) => page.reviews).length

        const remainingReviews =
          lastPage.itemReviewTotalCount - allReviewsLoaded

        if (allPages.length === 1) {
          if (allReviewsLoaded <= INITIAL_SIZE && remainingReviews === 0) {
            return null
          }
        } else if (
          remainingReviews === 0 ||
          remainingReviews < REVIEW_FETCH_SIZE
        ) {
          return null
        }

        return lastPage.nextCursorId
      },
      staleTime: 1000 * 60,
    })

  const reviewList = useMemo(
    () => (data ? data.pages.flatMap((pageData) => pageData.reviews) : []),
    [data],
  )

  return { data, reviewList, fetchNextPage, isFetchingNextPage, hasNextPage }
}
