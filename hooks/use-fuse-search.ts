'use client';

import { useMemo } from 'react';
import Fuse, { IFuseOptions, FuseResult, FuseOptionKey } from 'fuse.js';

export interface UseFuseSearchOptions<T> extends Partial<IFuseOptions<T>> {
  keys: FuseOptionKey<T>[] | string[];
  threshold?: number;
  minMatchCharLength?: number;
  ignoreLocation?: boolean;
  minMatchPercentage?: number;
}

export interface UseFuseSearchResult<T> {
  results: T[];
  fuseResults: FuseResult<T>[];
  hasQuery: boolean;
  fuseInstance: Fuse<T>;
}

export function useFuseSearch<T>(
  list: T[],
  query: string,
  options: UseFuseSearchOptions<T>
): UseFuseSearchResult<T> {
  const {
    keys,
    threshold = 0.4,
    minMatchCharLength = 1,
    ignoreLocation = true,
    includeScore = true,
    includeMatches = true,
    shouldSort = true,
    minMatchPercentage = 60,
    ...restOptions
  } = options;

  const fuseInstance = useMemo(() => {
    const fuseOpts: IFuseOptions<T> = {
      keys: keys as IFuseOptions<T>['keys'],
      threshold,
      minMatchCharLength,
      ignoreLocation,
      includeScore,
      includeMatches,
      shouldSort,
      ...restOptions,
    };
    return new Fuse(list, fuseOpts);
  }, [list, keys, threshold, minMatchCharLength, ignoreLocation, includeScore, includeMatches, shouldSort, restOptions]);

  const { fuseResults, results, hasQuery } = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return {
        fuseResults: [],
        results: list,
        hasQuery: false,
      };
    }

    const rawResults = fuseInstance.search(trimmedQuery);

    // Filter results strictly for 60%+ similarity matches
    const filteredFuseResults = rawResults.filter((res) => {
      if (res.score !== undefined) {
        const similarityPct = Math.round((1 - res.score) * 100);
        return similarityPct >= minMatchPercentage;
      }
      return true;
    });

    return {
      fuseResults: filteredFuseResults,
      results: filteredFuseResults.map((r) => r.item),
      hasQuery: true,
    };
  }, [fuseInstance, list, query, minMatchPercentage]);

  return {
    results,
    fuseResults,
    hasQuery,
    fuseInstance,
  };
}
