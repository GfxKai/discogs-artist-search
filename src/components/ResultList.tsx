/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import './ResultList.css';
import { SearchResult } from '../api';

interface SearchResultItemProps {
    resultInfo: SearchResult;
    onResultSelect: Function;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ resultInfo, onResultSelect }) => (
    <div
        className="search-result-item"
        onMouseDown={ () => onResultSelect(resultInfo) }
    >
        <img
            className="search-result-thumb"
            alt={ resultInfo.title }
            src={ resultInfo.thumb || 'https://a.discogs.com/36578972f1eb346e1fbd5f027d457e27ecf79613/images/default-artist.png' }
        />
        <span className="search-result-label">{ resultInfo.title }</span>
    </div>
);

interface ResultListProps {
    searchResults: SearchResult[];
    onResultSelect: Function;
}

const ResultList: React.FC<ResultListProps> = ({ searchResults, onResultSelect }) => {
    const SearchResults = searchResults.map(
        (result) => (
            <SearchResultItem
                key={ result.id }
                resultInfo={ result }
                onResultSelect={ onResultSelect }
            />
        )
    );
    return (
        <div className="search-result-container">
            { SearchResults }
        </div>
    );
};

export default ResultList;
