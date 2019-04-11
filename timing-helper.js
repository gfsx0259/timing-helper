/*
 * Timing Helper 1.0.0
 * MIT license
 */

(function () {
    'use strict';

    var timing = (function () {
        var timingAttributes = [
            'navigationStart',
            'unloadEventStart',
            'unloadEventEnd',
            'redirectStart',
            'redirectEnd',
            'fetchStart',
            'domainLookupStart',
            'domainLookupEnd',
            'connectStart',
            'connectEnd',
            'secureConnectionStart',
            'requestStart',
            'responseStart',
            'responseEnd',
            'domLoading',
            'domInteractive',
            'domContentLoadedEventStart',
            'domContentLoadedEventEnd',
            'domComplete',
            'loadEventStart',
            'loadEventEnd'
        ];

        /**
         * Calculate and return custom performance measurements for window
         *
         * @param window
         * @return {Object} Custom performance measurements
         */
        return function (window) {
            var performance = window.performance ||
                window.webkitPerformance ||
                window.msPerformance ||
                window.mozPerformance;

            if (performance === undefined) {
                return false;
            }

            var timestamp, first, previous, intervals = {};

            timingAttributes.forEach(function (attr) {
                timestamp = performance.timing[attr];

                if (isFinite(timestamp) && timestamp !== 0) {
                    if (!first) {
                        first = timestamp
                    }
                    previous = timestamp;
                    intervals[attr] = timestamp - first;
                } else {
                    intervals[attr] = previous - first;
                }
            });

            return calculateMeasurements(intervals);
        };
    })();

    /**
     * Convert intervals to custom measurements
     *
     * @param intervals
     * @return {Object}
     */
    function calculateMeasurements(intervals) {
        var measurements = {};

        // Total time from start to load
        measurements.loadTime = intervals.loadEventEnd - intervals.fetchStart;
        // Time spent constructing the DOM tree
        measurements.domReadyTime = intervals.domComplete - intervals.domInteractive;
        // Time consumed preparing the new page
        measurements.readyStart = intervals.fetchStart - intervals.navigationStart;
        // Time spent during redirection
        measurements.redirectTime = intervals.redirectEnd - intervals.redirectStart;
        // AppCache
        measurements.appcacheTime = intervals.domainLookupStart - intervals.fetchStart;
        // Time spent unloading documents
        measurements.unloadEventTime = intervals.unloadEventEnd - intervals.unloadEventStart;
        // DNS query time
        measurements.lookupDomainTime = intervals.domainLookupEnd - intervals.domainLookupStart;
        // TCP connection time
        measurements.connectTime = intervals.connectEnd - intervals.connectStart;
        // Time spent during the request
        measurements.requestTime = intervals.responseEnd - intervals.requestStart;
        // Request to completion of the DOM loading
        measurements.initDomTreeTime = intervals.domInteractive - intervals.responseEnd;
        // Load event time
        measurements.loadEventTime = intervals.loadEventEnd - intervals.loadEventStart;

        return measurements;
    }

    // Expose as a commonjs module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = timing;
    }
})();
