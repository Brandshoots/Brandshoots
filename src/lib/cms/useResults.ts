import { useCallback, useEffect, useState } from 'react';
import {
  DataSnapshot,
  limitToFirst,
  onValue,
  orderByChild,
  query,
  ref,
} from 'firebase/database';
import { firebaseDb } from '../firebase';
import { CMSResult } from '../../types/cms';
import { INITIAL_RESULTS } from './seedData';

const RESULTS_PATH = 'published/results';
export const INITIAL_RESULTS_LIMIT = 6;
export const RESULTS_PAGE_SIZE = 6;

interface ResultsState {
  results: CMSResult[];
  isLoading: boolean;
  error: Error | null;
}

export interface FeaturedResultsState extends ResultsState {}

export interface PaginatedResultsState extends ResultsState {
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

function snapshotResults(snapshot: DataSnapshot): CMSResult[] {
  const results: CMSResult[] = [];

  snapshot.forEach((childSnapshot) => {
    const value: unknown = childSnapshot.val();
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;

    const result = value as CMSResult;
    results.push({
      ...result,
      id: result.id || childSnapshot.key || '',
    });
  });

  return results;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Unable to load results.');
}

export function useFeaturedResults(): FeaturedResultsState {
  const [results, setResults] = useState<CMSResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const featuredQuery = query(
      ref(firebaseDb, RESULTS_PATH),
      orderByChild('homepageOrder'),
      limitToFirst(3)
    );

    const unsubscribe = onValue(
      featuredQuery,
      (snapshot) => {
        const publishedFeatured = snapshotResults(snapshot)
          .filter((result) => result.status === 'published' && result.featured)
          .slice(0, 3);

        setResults(
          publishedFeatured.length > 0
            ? publishedFeatured
            : INITIAL_RESULTS.filter((result) => result.status === 'published' && result.featured).slice(0, 3)
        );
        setError(null);
        setIsLoading(false);
      },
      (listenerError) => {
        const fallbackFeatured = INITIAL_RESULTS.filter(
          (result) => result.status === 'published' && result.featured
        ).slice(0, 3);
        setResults(fallbackFeatured);
        setError(fallbackFeatured.length > 0 ? null : asError(listenerError));
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { results, isLoading, error };
}

export function useResults(): PaginatedResultsState {
  const [currentVisibleLimit, setCurrentVisibleLimit] = useState(INITIAL_RESULTS_LIMIT);
  const [results, setResults] = useState<CMSResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const resultsQuery = query(
      ref(firebaseDb, RESULTS_PATH),
      orderByChild('order'),
      limitToFirst(currentVisibleLimit + 1)
    );

    const unsubscribe = onValue(
      resultsQuery,
      (snapshot) => {
        const queriedResults = snapshotResults(snapshot);
        const publishedResults = queriedResults.filter((result) => result.status === 'published');
        const resolvedResults =
          publishedResults.length > 0
            ? publishedResults
            : INITIAL_RESULTS.filter((result) => result.status === 'published');

        setResults(resolvedResults.slice(0, currentVisibleLimit));
        setHasMore(
          publishedResults.length > 0
            ? queriedResults.length > currentVisibleLimit
            : resolvedResults.length > currentVisibleLimit
        );
        setError(null);
        setIsLoading(false);
        setIsLoadingMore(false);
      },
      (listenerError) => {
        const fallbackResults = INITIAL_RESULTS.filter((result) => result.status === 'published');
        setResults(fallbackResults.slice(0, currentVisibleLimit));
        setHasMore(fallbackResults.length > currentVisibleLimit);
        setError(fallbackResults.length > 0 ? null : asError(listenerError));
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    );

    return unsubscribe;
  }, [currentVisibleLimit]);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setCurrentVisibleLimit((limit) => limit + RESULTS_PAGE_SIZE);
  }, [hasMore, isLoading, isLoadingMore]);

  return {
    results,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  };
}
