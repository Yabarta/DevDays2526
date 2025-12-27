class SimpleExporter {
    _store = [];

    export(spans, resultCallback) {
        this._store.push(...spans);
        // console.log(`Exported ${spans.length} spans`);
        resultCallback({ code: 0 });
    }

    shutdown() {
        return Promise.resolve();
    }

    getFinishedSpans() {
        return this._store;
    }
}

export { SimpleExporter };