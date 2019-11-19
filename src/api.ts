/* eslint-disable camelcase */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import DISCOGS_TOKEN from './token';

// request types
export interface SearchRequestConfig {
    query: string;
    type: 'artist';
    per_page: number;
    page?: number;
}

export type SortField = 'year' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface ReleasesRequestConfig {
    sort: SortField;
    sort_order: SortOrder;
    per_page: number;
    page?: number;
}

export type IdentityRequestConfig = undefined; // no params for identity call

export type RequestConfig = IdentityRequestConfig | SearchRequestConfig | ReleasesRequestConfig;

// minimal response types
export interface IdentityResponse {
    id: number;
    username: string;
    resource_url: string;
    consumer_name: string;
}

export interface SearchResult {
    id: number;
    thumb: string;
    title: string;
}
export interface SearchResponse {
    pagination: object;
    results: SearchResult[];
}

export interface ReleasesResult {
    id: number;
    thumb: string;
    title: string;
    type: string;
    year: number;
}
export interface ReleasesResponse {
    pagination: object;
    releases: ReleasesResult[];
}

export interface SuccessResponse<T> {
    data: T;
    error: null;
}

export interface RequestError {
    code: number|null;
    message: string;
}
export interface ErrorResponse {
    data: null;
    error: RequestError;
}

export type RequestResponse<T> = SuccessResponse<T>|ErrorResponse;

export type AsyncRequestResponse<T> = Promise<RequestResponse<T>>;

class DiscogsAPI {
    private API: AxiosInstance;

    private isAuthorised: boolean;

    constructor(token: string) {
        this.API = this.initialiseAPI(token);
        this.isAuthorised = false;
    }

    private initialiseAPI = (token: string): AxiosInstance => axios.create({
        baseURL: 'https://api.discogs.com',
        timeout: 10000,
        headers: {
            Authorization: `Discogs token=${token}`
        }
    });

    private handleRequestSuccess = <T>(response: AxiosResponse): SuccessResponse<T> => ({
        data: response.data,
        error: null,
    });

    private handleRequestError = (e: AxiosError): ErrorResponse => {
        let errorInfo: RequestError;
        if (e.response) {
            errorInfo = {
                code: e.response.status,
                message: e.response.data.message,
            };
        } else {
            errorInfo = {
                code: null,
                message: 'The request timed out',
            };
        }
        const errorResponse: ErrorResponse = {
            data: null,
            error: errorInfo,
        };
        return errorResponse;
    }

    private makeRequest = <T>(
        endpoint: string,
        params: RequestConfig
    ): AsyncRequestResponse<T> => (
        this.API.get(
            endpoint, { params }
        ).then(
            (response) => this.handleRequestSuccess<T>(response)
        ).catch(
            (error) => this.handleRequestError(error)
        )
    )

    private identifyUser = (): AsyncRequestResponse<IdentityResponse> => {
        const endpoint = '/oauth/identity';
        let params: IdentityRequestConfig;
        return this.makeRequest(endpoint, params);
    }

    private checkAuthorisation = (
        identityResponse: RequestResponse<IdentityResponse>
    ): Promise<void> => (
        new Promise(
            (resolve, reject) => {
                if (identityResponse.error) {
                    reject(identityResponse);
                } else {
                    // set authorised
                    this.isAuthorised = true;
                    // return promise to allow chaining
                    resolve();
                }
            }
        )
    )

    private makeAuthenticatedRequest = <T>(
        endpoint: string,
        params: RequestConfig,
    ): AsyncRequestResponse<T> => {
        // pass through request if already authorised
        if (this.isAuthorised) {
            return this.makeRequest(endpoint, params);
        }
        // else try to authenticate
        return this.identifyUser().then(
            // if unauthorised, reject promise with auth error response
            this.checkAuthorisation
        ).then(
            // otherwise return response for original request
            () => this.makeRequest(endpoint, params)
        ).catch(
            // return auth error object
            (identityError) => identityError
        );
    }

    searchArtists = (query: string): AsyncRequestResponse<SearchResponse> => {
        const endpoint = '/database/search';
        const params: SearchRequestConfig = {
            query,
            type: 'artist',
            per_page: 10,
        };
        return this.makeAuthenticatedRequest(endpoint, params);
    }

    getReleases = (
        artistId: number,
        sortField: SortField = 'year',
        sortOrder: SortOrder = 'desc',
    ): AsyncRequestResponse<ReleasesResponse> => {
        const endpoint = `/artists/${artistId}/releases`;
        const params: ReleasesRequestConfig = {
            sort: sortField,
            sort_order: sortOrder,
            per_page: 25,
        };
        return this.makeAuthenticatedRequest(endpoint, params);
    }
}

const InitialisedDiscogsAPI = new DiscogsAPI(DISCOGS_TOKEN);

export default InitialisedDiscogsAPI;
