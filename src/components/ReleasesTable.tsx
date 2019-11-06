import React from 'react';
import './ReleasesTable.css';
import { ReleasesResult, SearchResult } from '../api';
import Button from './Button';

interface ReleaseItemProps {
    releaseInfo: ReleasesResult;
}

const ReleaseItem: React.FC<ReleaseItemProps> = ({ releaseInfo }) => (
    <div className="release-item">
        <img
            className="release-item-thumb"
            alt={ releaseInfo.title }
            src={ releaseInfo.thumb || 'https://a.discogs.com/36578972f1eb346e1fbd5f027d457e27ecf79613/images/default-release.png' }
        />
        <span style={{ flex: 1 }}>{ releaseInfo.title }</span>
        <span style={{ marginRight: 24 }}>{ releaseInfo.year }</span>
    </div>
);

interface ReleasesTableProps {
    artist?: SearchResult;
    releases: ReleasesResult[];
    sortField: 'year'|'title';
    setSortField: Function;
    sortOrder: 'asc'|'desc';
    setSortOrder: Function;
}

const ReleasesTable: React.FC<ReleasesTableProps> = ({
    artist,
    releases,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder
}) => {
    const Releases = releases.map(
        (release) => (
            <ReleaseItem key={ release.id } releaseInfo={ release } />
        )
    );
    return (
        <div className="release-table-container">
            <div className="release-table-header-row">
                <span className="release-table-header-label">
                    { artist && `${artist.title} Releases` }
                </span>
                <Button
                    label="Sort By Title"
                    action={ () => setSortField('title') }
                    toggleState={ sortField === 'title' }
                    style={{ fontSize: 14, marginLeft: 12 }}
                />
                <Button
                    label="Sort By Year"
                    action={ () => setSortField('year') }
                    toggleState={ sortField === 'year' }
                    style={{ fontSize: 14, marginLeft: 12 }}
                />
                <Button
                    label="Ascending"
                    action={ () => setSortOrder('asc') }
                    toggleState={ sortOrder === 'asc' }
                    style={{ fontSize: 14, marginLeft: 36 }}
                />
                <Button
                    label="Descending"
                    action={ () => setSortOrder('desc') }
                    toggleState={ sortOrder === 'desc' }
                    style={{ fontSize: 14, marginLeft: 12 }}
                />
            </div>
            <div className="release-table">
                { Releases }
            </div>
        </div>
    );
};

export default ReleasesTable;
