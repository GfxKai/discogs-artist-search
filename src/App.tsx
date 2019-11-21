import React, { useState } from 'react';
import { AlertsWrapper } from 'react-spring-alerts';

import { SearchResult, SortOrder, SortField } from './api';
import { useDebounce, useDiscogsSearch, useDiscogsReleases } from './hooks';

import Input from './components/Input';
import ResultsList from './components/ResultList';
import ReleasesTable from './components/ReleasesTable';
import './App.css';

const App: React.FC = () => {
    const [queryValue, setQueryValue] = useState<string>('');

    const debouncedQueryValue = useDebounce(queryValue, 350);

    const searchResults = useDiscogsSearch(debouncedQueryValue);

    const [selectedArtist, setSelectedArtist] = useState<SearchResult>();

    const onResultSelect = (artist: SearchResult): void => {
        setSelectedArtist(artist);
        setQueryValue('');
    };

    const [releasesSortField, setReleasesSortField] = useState<SortField>('year');
    const [releasesSortOrder, setReleasesSortOrder] = useState<SortOrder>('desc');

    const [releasesPage, setReleasesPage] = useState(1);

    const [
        artistReleases,
        isLoading
    ] = useDiscogsReleases(
        selectedArtist,
        releasesSortField,
        releasesSortOrder,
        releasesPage,
    );

    const [searchFocused, setSearchFocused] = useState<boolean>(false);
    return (
        <div className="app">
            <span className="title">
                Discogs Artist Search
            </span>
            <div className="search-bar">
                <Input
                    value={ queryValue }
                    placeholder="Search for an artist..."
                    handleChange={ setQueryValue }
                    onFocus={ () => setSearchFocused(true) }
                    onBlur={ () => setSearchFocused(false) }
                    style={{ width: 300 }}
                />
                {
                    searchFocused
                    && searchResults.length > 0
                    && (
                        <ResultsList
                            searchResults={ searchResults }
                            onResultSelect={ onResultSelect }
                        />
                    )
                }
            </div>
            <ReleasesTable
                isLoading={ isLoading }
                artist={ selectedArtist }
                releases={ artistReleases }
                sortField={ releasesSortField }
                setSortField={ setReleasesSortField }
                sortOrder={ releasesSortOrder }
                setSortOrder={ setReleasesSortOrder }
                page={ releasesPage }
                setPage={ setReleasesPage }
            />
        </div>
    );
};

const AppWithAlerts: React.FC = () => (
    <AlertsWrapper>
        <App />
    </AlertsWrapper>
);

export default AppWithAlerts;
