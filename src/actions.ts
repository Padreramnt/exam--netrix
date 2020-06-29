import store from './store'

export async function fetchAnalyticEvents(...args: Parameters<typeof fetch>) {
	const id = Symbol()
	store.dispatch({ type: 'AnalyticEventsFetchAction', payload: { id } })
	try {
		const data = await (fetch(...args).then(it => it.json()))
		store.dispatch({ type: 'AnalyticEventFetchSuccessAction', payload: { id, data } })
	} catch (error) {
		store.dispatch({ type: 'AnalyticEventFetchFailureAction', payload: { id, error } })
	}
}
