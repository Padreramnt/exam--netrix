import { connect } from 'react-redux'
import { mapStateToProps, State } from './store'
import * as React from 'react'
import { VIDEO_SRC } from './const'

export interface VideoPlayerProps extends Pick<State, 'analyticEvents' | 'videoPlayer'> {

}

export interface VideoPlayerState {
	currentTime: number
	videoHeight: number
	videoWidth: number
}

export interface IVideoPlayer {
	setCurrentTime(timestamp: number): void
}

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> implements IVideoPlayer {
	constructor(props: VideoPlayerProps) {
		super(props)
		this.state = {
			currentTime: props.videoPlayer.currentTime,
			videoWidth: 0,
			videoHeight: 0,
		}
		this.videoRef = React.createRef()
		this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
		this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this)
		this.handleResize = this.handleResize.bind(this)
	}
	readonly videoRef: React.RefObject<HTMLVideoElement>
	setCurrentTime(currentTime: number) {
		if (this.videoRef.current && this.videoRef.current.currentTime != currentTime) {
			this.videoRef.current.currentTime = currentTime
			this.setState({ currentTime })
		}
		this.updateVideoSize()
	}
	componentDidUpdate(prevProps: VideoPlayerProps) {
		if (this.props.videoPlayer !== prevProps.videoPlayer) {
			this.setCurrentTime(this.props.videoPlayer.currentTime)
		}
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleResize, true)
		this.updateVideoSize()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize, true)
	}
	handleTimeUpdate() {
		if (this.videoRef.current) {
			this.setState({
				currentTime: this.videoRef.current.currentTime,
			})
		}
	}
	handleLoadedMetadata() {
		this.updateVideoSize()
	}
	handleResize() {
		this.updateVideoSize()
	}
	handleClick(e: React.MouseEvent<HTMLVideoElement, MouseEvent>) {
		if (e.currentTarget.paused) {
			e.currentTarget.play()
		} else {
			e.currentTarget.pause()
		}
	}
	updateVideoSize() {
		if (this.videoRef.current) {
			this.setState({
				videoHeight: this.videoRef.current.videoHeight,
				videoWidth: this.videoRef.current.videoWidth,
			})
		}
	}
	render() {
		const { videoHeight, videoWidth, currentTime } = this.state
		const currentTimestamp = currentTime * 1000
		const analyticEvents = this.props.analyticEvents.done && 'data' in this.props.analyticEvents && this.props.analyticEvents.data.filter(it => it.timestamp <= currentTimestamp && currentTimestamp <= (it.timestamp + it.duration)) || []
		return (
			<div className='responsive'>
				<div className='video'>
					<video
						ref={this.videoRef}
						src={VIDEO_SRC}
						onTimeUpdate={this.handleTimeUpdate}
						onLoadedMetadata={this.handleLoadedMetadata}
						onClick={this.handleClick}
					/>
					{analyticEvents.map(it => (
						<div
							key={it.id}
							className='frame'
							style={{
								top: (videoHeight > 0 ? (100 * it.zone.top / videoHeight) + '%' : void 0),
								height: (videoHeight > 0 ? (100 * it.zone.height / videoHeight) + '%' : void 0),
								left: (videoWidth > 0 ? (100 * it.zone.left / videoWidth) + '%' : void 0),
								width: (videoWidth > 0 ? (100 * it.zone.width / videoWidth) + '%' : void 0),
							}}
						/>
					))}
				</div>
			</div>
		)
	}
}

export default connect(
	mapStateToProps('analyticEvents', 'videoPlayer')
)(VideoPlayer)
