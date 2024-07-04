import axios from 'axios';
import { Axios } from "axios";

export default class Backend {

    constructor() {
        this.backendURL = new URL(process.env.REACT_APP_BACKEND_URL);
        this.httpClient = axios.create();
    }

    /**
     * Get all of the scans for a user.
     * 
     * @param {string} user the user to get the scans for
     * @returns an array of scan objects in JSON format
     */
    async getUserScans(user) {
        return await this._get(
            `/scans/${user}`,
            { queryParams: { "pretty-printed": false } }
        );
    }

    /**
     * Scan a barcode for a user.
     * 
     * @param {string} user the user to scan the barcode for
     * @param {string} barcode the barcode to scan
     * @returns the response from the server
     */
    async scanBarcode({user, barcode}) {
        return await this._apiRequest({
            method: "POST",
            path: `/scan/${user}`,
            body: {
                barcode: barcode
            }
        });
    }

    /**
     * Delete scans by ID.
     * 
     * @param {Array<String>} scanIds an array of scan IDs to delete
     * @returns the response from the server
     */
    async deleteScans(scanIds) {
        let body = {
            ids: scanIds
        };
        return await this._apiRequest({
            method: "DELETE",
            path: "/scans",
            body: body
        });
    }

    /**
     * Delete all scans for a user, or just those older than t seconds before
     * the current date.
     * 
     * @param {String} user the user to delete the scans for
     * @param {Integer} olderThan the number of seconds before the current date
     * to delete scans for
     * @returns the response from the server
     */
    async deleteUserScans({user, olderThan}) {
        if (olderThan) {
            return await this._apiRequest({
                method: "DELETE",
                path: `/scans/${user}/older`,
                queryParams: {
                    t: olderThan
                }
            });
        }
        else {
            return await this._apiRequest({
                method: "DELETE",
                path: `/scans/${user}`
            });
        }
    }

    /**
     * Delete all scans for a user except the last n scans.
     * 
     * @param {String} user the user to delete the scans for 
     * @param {Integer} last the number of most recent scans to keep
     * @returns 
     */
    async deleteUserScansExcept({user, last}) {
        return await this._apiRequest({
            method: "DELETE",
            path: `/scans/${user}/except-last`,
            queryParams: {
                n: last
            }
        });
    }

    // MARK: Wrappers

    async _get(path, {queryParams, headers} = {}) {
        return await this._apiRequest({
            method: "GET",
            path: path,
            queryParams: queryParams,
            headers: headers
        });
    }

    async _apiRequest({
        method, 
        path, 
        queryParams, 
        body, 
        headers
    }) {
        let response = await this.httpClient.request({
            baseURL: this.backendURL.toString(),
            method: method,
            url: path,
            headers: headers,
            params: queryParams,
            data: body
        });
        return response.data;
    }

}
