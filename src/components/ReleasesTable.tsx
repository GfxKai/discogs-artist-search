import React from 'react';
import './ReleasesTable.css';
import { ReleasesResult, SearchResult, SortField, SortOrder } from '../api';
import Button from './Button';
import LoadingVinyl from './Loading';

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
    isLoading: boolean;
    artist: SearchResult | undefined;
    releases: ReleasesResult[];
    sortField: SortField;
    setSortField: React.Dispatch<React.SetStateAction<SortField>>;
    sortOrder: SortOrder;
    setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const ReleasesTable: React.FC<ReleasesTableProps> = ({
    isLoading,
    artist,
    releases,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    page,
    setPage,
}) => {
    const Releases = releases.map(
        (release) => (
            <ReleaseItem key={ release.id } releaseInfo={ release } />
        )
    );
    const previousPage = () => setPage((currentPage) => currentPage - 1);
    const nextPage = () => setPage((currentPage) => currentPage + 1);
    return (
        <div className="release-table-container">
            <div className="release-table-header-row">
                <span className="release-table-header-label">
                    { artist && `${artist.title} Releases` }
                </span>
                <Button
                    label="Sort By Title"
                    action={ () => setSortField('title') }
                    isToggled={ sortField === 'title' }
                    style={{ marginLeft: 12 }}
                />
                <Button
                    label="Sort By Year"
                    action={ () => setSortField('year') }
                    isToggled={ sortField === 'year' }
                    style={{ marginLeft: 12 }}
                />
                <Button
                    label="Ascending"
                    action={ () => setSortOrder('asc') }
                    isToggled={ sortOrder === 'asc' }
                    style={{ marginLeft: 36 }}
                />
                <Button
                    label="Descending"
                    action={ () => setSortOrder('desc') }
                    isToggled={ sortOrder === 'desc' }
                    style={{ marginLeft: 12 }}
                />
            </div>
            <div className="release-table">
                <div className="release-list">
                    { Releases }
                </div>
                { isLoading && (
                    <div className="load-overlay">
                        <LoadingVinyl />
                    </div>
                )}
            </div>
            <div className="release-table-footer">
                <Button
                    label="<"
                    action={ previousPage }
                    disabled={ !artist || page === 1 }
                />
                <span style={{ width: 20, textAlign: 'center', marginLeft: 12 }}>{ page }</span>
                <Button
                    label=">"
                    action={ nextPage }
                    disabled={ !artist }
                    style={{ marginLeft: 12 }}
                />
            </div>
        </div>
    );
};

export default ReleasesTable;
