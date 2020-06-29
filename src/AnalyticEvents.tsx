import store, { Q, AnalyticEvent, mapStateToProps } from './store'
import { connect } from 'react-redux'
import * as React from 'react'
import { fetchAnalyticEvents } from './actions'
import { ANALYTIC_EVENTS_API } from './const'


function AnalyticEvents(props: { analyticEvents: Q<AnalyticEvent[]> }) {
	if (props.analyticEvents.done && 'data' in props.analyticEvents) {
		return (
			<ul className='analytic-events overflow'>
				{props.analyticEvents.data.sort((a, b) => a.timestamp - b.timestamp).map(it => {
					const date = new Date(it.timestamp)
					const minutes = date.getMinutes().toString().padStart(2, '0')
					const seconds = date.getSeconds().toString().padStart(2, '0')
					const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
					const timestamp = [minutes, seconds, milliseconds].join(':')
					return (
						<li key={it.id}>
							<button onClick={e => { e.preventDefault(); store.dispatch({ type: 'VideoPlayerSetCurrentTimeAction', payload: { currentTime: it.timestamp / 1000 } }) }}>
								{timestamp}
							</button>
						</li>
					)
				})}
			</ul>
		)
	} else if (props.analyticEvents.done) {
		return (
			<div className='analytic-events overflow'>
				{`Error: "${String(props.analyticEvents.error)}"`}
				<br />
				<button onClick={e => { e.preventDefault(); fetchAnalyticEvents(ANALYTIC_EVENTS_API) }}>
					{'try againg'}
				</button>
			</div>
		)
	} else {
		return (
			<div className='analytic-events overflow'>
				{`loading analytic events`}
			</div>
		)
	}
}

export default connect(
	mapStateToProps('analyticEvents')
)(AnalyticEvents)
