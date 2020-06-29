import {
	createStore,
	// combineReducers,
	Store,
	combineReducers,
} from 'redux'

export interface Rectangle {
	top: number
	left: number
	width: number
	height: number
}

export interface AnalyticEvent {
	id: number
	timestamp: number
	duration: number
	zone: Rectangle
}

export type Q<T> =
	| { readonly id: symbol, readonly done: false }
	| { readonly id: symbol, readonly done: true, readonly data: T }
	| { readonly id: symbol, readonly done: true, readonly error: any }

export interface AnalyticEventsFetchAction {
	type: 'AnalyticEventsFetchAction'
	payload: { id: symbol }
}

export interface AnalyticEventFetchSuccessAction {
	type: 'AnalyticEventFetchSuccessAction'
	payload: {
		id: symbol
		data: AnalyticEvent[]
	}
}
export interface AnalyticEventFetchFailureAction {
	type: 'AnalyticEventFetchFailureAction'
	payload: {
		id: symbol
		error: any
	}
}

export type AnalyticEventActionU =
	| AnalyticEventsFetchAction
	| AnalyticEventFetchSuccessAction
	| AnalyticEventFetchFailureAction

function analyticEvents(state: Q<AnalyticEvent[]> = {
	id: Symbol(),
	done: false,
}, action: AnalyticEventActionU): Q<AnalyticEvent[]> {
	switch (action.type) {
		case 'AnalyticEventsFetchAction':
			return { ...action.payload, done: false }
		case 'AnalyticEventFetchFailureAction':
		case 'AnalyticEventFetchSuccessAction':
			return state.id === action.payload.id ? { ...action.payload, done: true } : state
		default:
			return state
	}
}

export interface VideoPlayerState {
	currentTime: number
}

export interface VideoPlayerSetCurrentTimeAction {
	type: 'VideoPlayerSetCurrentTimeAction'
	payload: {
		currentTime: number
	}
}

export type VideoPlayerStateActionU =
	| VideoPlayerSetCurrentTimeAction

function videoPlayer(state: VideoPlayerState = {
	currentTime: 0,
}, action: VideoPlayerStateActionU) {
	switch (action.type) {
		case 'VideoPlayerSetCurrentTimeAction':
			return { ...state, ...action.payload }
		default:
			return state
	}
}

export type InferState<T> = T extends Store<infer R, any> ? R : null
export type InferAction<T> = T extends Store<any, infer R> ? R : null

const store = createStore(combineReducers({
	analyticEvents,
	videoPlayer,
}))

export type State = InferState<typeof store>
export type Action = InferAction<typeof store>

export function mapStateToProps<T extends State, K extends keyof T>(...keys: K[]) {
	return (state: T): Pick<T, K> => {
		const o: Pick<T, K> = {} as any
		for (const key of keys) {
			o[key] = state[key]
		}
		return o
	}
}

export default store
