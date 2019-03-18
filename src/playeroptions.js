const options = {
  //audio lists model
  audioLists: [],
   defaultPosition: {
    top: 20,
    left: 20
  },
  autoPlay: false,
  bounds: "body",
  // play mode text config of the audio player
  playModeText: {
    order: "order",
    orderLoop: "order loop",
    singleLoop: "single loop",
    shufflePlay: "shuffle"
  },
  openText: "open",
  closeText: "close",
  defaultPlayMode: "order",
  //audio playing progress is show of the "mini"  mode
  showMiniProcessBar: false,
  //reload button display of the audio player panel   [type `Boolean` default `true`]
  showReload: false,
  //download button display of the audio player panel   [type `Boolean` default `true`]
  showDownload: false,
  //loop button display of the audio player panel   [type `Boolean` default `true`]
  showPlayMode: true,
  //theme toggle switch  display of the audio player panel   [type `Boolean` default `true`]
  showThemeSwitch: false,
  //playModeText show time [type `Number(ms)` default `700`]
  playModeShowTime: 600,
  //Music is downloaded handle
  onAudioDownload(audioInfo) {
   // swal("download successfully", "", "success");
    console.log("audio download", audioInfo);
  },

  //audio play handle
  onAudioPlay(audioInfo) {
    console.log("audio playing", audioInfo);
  },

  //audio pause handle
  onAudioPause(audioInfo) {
    console.log("audio pause", audioInfo);
  },

  //When the user has moved/jumped to a new location in audio
  onAudioSeeked(audioInfo) {
    console.log("audio seeked", audioInfo);
  },

  //When the volume has changed  min = 0.0  max = 1.0
  onAudioVolumeChange(currentVolume) {
    console.log("audio volume change", currentVolume);
  },

  //The single song is ended handle
  onAudioEnded(audioInfo) {
    //swal("Audio is ended!", "", "success");
    console.log("audio ended", audioInfo);
  },

  //audio load abort The target event like {...,audioName:xx,audioSrc:xx,playMode:xx}
  onAudioAbort(e) {
    console.log("audio abort", e);
  },

  //audio play progress handle
  onAudioProgress(audioInfo) {
    // console.log('audio progress',audioInfo);
  },

  //audio reload handle
  onAudioReload(audioInfo) {
    console.log("audio reload:", audioInfo);
  },

  //audio load failed error handle
  onAudioLoadError(e) {
    //swal("audio load error", "", "error");
    console.log("audio load err", e);
  },

  //theme change handle
  onThemeChange(theme) {
    console.log("theme change:", theme);
  },

  onAudioListsChange(currentPlayIndex, audioLists, audioInfo) {
    console.log("audio lists change:", currentPlayIndex);
    console.log("audio lists change:", audioLists);
    console.log("audio lists change:", audioInfo);
  },

  onAudioPlayTrackChange(currentPlayIndex, audioLists, audioInfo) {
    console.log(
      "audio play track change:",
      currentPlayIndex,
      audioLists,
      audioInfo
    );
  },

  onPlayModeChange(playMode) {
    console.log("play mode change:", playMode);
  },

  onModeChange(mode) {
    console.log("mode change:", mode);
  },

  onAudioListsPanelChange(panelVisible) {
    console.log("audio lists panel visible:", panelVisible);
  },

  onAudioListsDragEnd(fromIndex, endIndex) {
    console.log("audio lists drag end:", fromIndex, endIndex);
  }
};
module.exports = options;
