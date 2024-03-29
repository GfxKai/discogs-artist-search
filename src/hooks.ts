import { useState, useEffect, useRef } from 'react';
import { useAlerts } from 'react-spring-alerts';

import DiscogsAPI, {
    SearchResult,
    ReleasesResult,
    SortField,
    SortOrder
} from './api';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        // Update debounced value after delay
        const debounceHandler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // Prevents debounced value from updating if value is changed within the delay period
        return () => {
            clearTimeout(debounceHandler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes
    return debouncedValue;
}

const useDiscogsSearch = (query: string): SearchResult[] => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    // useRef to preserve Alerts context between renders
    const AlertsRef = useRef(useAlerts());
    useEffect(() => {
        const handleRequestError = (message: string): void => {
            AlertsRef.current.showAlert({
                type: 'error',
                title: 'Request Error',
                message,
            });
        };
        if (!query) {
            setSearchResults([]);
        } else {
            DiscogsAPI.searchArtists(query).then(
                (response) => {
                    if (!response.error && response.data) {
                        setSearchResults(response.data.results);
                    } else {
                        setSearchResults([]);
                        handleRequestError(response.error.message);
                    }
                }
            );
        }
    }, [query]);
    return searchResults;
};

type ReleasesHook = (
    artistInfo: SearchResult | undefined,
    sortField: SortField,
    sortOrder: SortOrder,
    page: number,
) => [
    ReleasesResult[],
    boolean,
];

const useDiscogsReleases: ReleasesHook = (
    artistInfo,
    sortField = 'year',
    sortOrder = 'asc',
    page,
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [releases, setReleases] = useState<ReleasesResult[]>([]);
    // useRef to preserve Alerts context between renders
    const AlertsRef = useRef(useAlerts());
    useEffect(() => {
        const handleRequestError = (message: string): void => {
            AlertsRef.current.showAlert({
                type: 'error',
                title: 'Request Error',
                message,
            });
        };
        if (!artistInfo) {
            setReleases([]);
        } else {
            setIsLoading(true);
            DiscogsAPI.getReleases(artistInfo.id, sortField, sortOrder, page).then(
                (response) => {
                    if (response.data && !response.error) {
                        setReleases(response.data.releases);
                    } else if (response.error) {
                        // handle error
                        setReleases([]);
                        handleRequestError(response.error.message);
                    }
                }
            ).finally(
                () => setIsLoading(false)
            );
        }
    }, [artistInfo, sortField, sortOrder, page]);
    return [releases, isLoading];
};

export {
    useDebounce,
    useDiscogsSearch,
    useDiscogsReleases,
};
