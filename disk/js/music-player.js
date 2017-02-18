function MusicPlayer(i){this.$container=i,this.$channelsList=this.$container.find(".c-channels-list"),this.channelId="",this.song={},this.$audio=$("#music"),console.log(this.$audio[0].duration),this.audio=this.$audio[0],this.$title=this.$container.find(".c-msg__title"),this.$artist=this.$container.find(".c-msg__artist"),this.$channel=this.$container.find(".c-msg__channel"),this.channelName="",this.poster=this.$container.find(".c-poster"),this.$posterImg=this.$container.find(".c-poster__img"),this.sid=null,this.lyric="",this.lyricTimeArr=[],this.$lyricList=this.$container.find(".c-lyric__list"),this.$lyric=this.$container.find(".c-lyric"),this.$playPause=this.$container.find(".c-control__play-pause"),this.$next=this.$container.find(".c-control__next"),this.$posterImg=this.$container.find(".c-poster__img"),this.$lyricBtn=this.$container.find(".c-setting__lyric"),this.$channelBtn=this.$container.find(".c-setting__channel"),this.$curTime=this.$container.find(".c-progress__current-time"),this.$totalTime=this.$container.find(".c-progress__total-time"),this.$curBar=this.$container.find(".c-progress__curbar"),this.$baseBar=this.$container.find(".c-progress__basebar"),this.totalTime="",this.curTime="",this.volume=null,this.$volumeBtn=this.$container.find(".c-setting__volume"),this.volume=this.audio.volume,this.$basicVolume=this.$container.find(".c-setting__basic-volume"),this.$curVolume=this.$container.find(".c-setting__cur-volume"),this.firstLoad=!0,this.init(),this.bind()}MusicPlayer.prototype.init=function(){this.getChannels(),this.autoPlay(),this.playStateChange()},MusicPlayer.prototype.bind=function(){this.changeLyric(),this.playPause(),this.nextSong(),this.changeChannel(),this.showLyric(),this.showChannelsList(),this.setTime(),this.changeProgress(),this.setMute(),this.changeVolume(),this.handleResize()},MusicPlayer.prototype.handleResize=function(){var i=this;$(window).resize(function(){window.innerWidth>768?i.poster.css("display","block"):i.$lyricBtn.hasClass("c-setting__lyric--active")&&i.poster.css("display","none")})},MusicPlayer.prototype.getChannels=function(){var i=this;this.$container.ready(function(){$.get("http://api.jirengu.com/fm/getChannels.php").done(function(t){for(var n=JSON.parse(t).channels,e=0;e<n.length;e++){var s='<li data-channel_id="'+n[e].channel_id+'" data-channel_name='+n[e].name+' class="c-channels-list__item">'+n[e].name+"</li>";i.$channelsList.append(s)}$(".c-channels-list__item").first().addClass("c-channels-list__item--active"),i.channelId=n[0].channel_id,i.channelName=n[0].name,i.getSong()})})},MusicPlayer.prototype.getSong=function(i){var t=this;$.get("http://api.jirengu.com/fm/getSong.php",{channel:t.channelId}).done(function(i){return t.song=JSON.parse(i).song[0],t.roadSong(),t.firstLoad?void(t.firstLoad=!1):void t.audio.play()})},MusicPlayer.prototype.roadSong=function(){this.audio.src=this.song.url,this.$title.text(this.song.title),this.$artist.text(this.song.artist),this.$channel.text("频道："+this.channelName),this.$posterImg.css("background-image","url("+this.song.picture+")"),this.getLyric()},MusicPlayer.prototype.getLyric=function(){var i=this;i.sid=this.song.sid,$.post("http://api.jirengu.com/fm/getLyric.php",{sid:i.sid}).done(function(t){i.lyric=JSON.parse(t).lyric,i.loadLyric()})},MusicPlayer.prototype.loadLyric=function(){this.$lyricList.find("p").remove(),this.lyricTimeArr=[];for(var i=this.lyric.split("\n"),t=0;t<i.length;t++){var n=i[t].slice(10)||"---",e='<p class="c-lyric__item'+t+'">'+n+"</p>";this.$lyricList.append(e);var s=Math.round(60*parseFloat(i[t].slice(1,3))+parseFloat(i[t].slice(4,9)));this.lyricTimeArr.push(s)}},MusicPlayer.prototype.changeLyric=function(){var i=this;this.$audio.on("timeupdate",function(){for(var t=Math.round(i.audio.currentTime),n=0;n<i.lyricTimeArr.length;n++)if(t===i.lyricTimeArr[n]){$(".c-lyric__item"+n).siblings().removeClass("c-lyric__item--active"),$(".c-lyric__item"+n).addClass("c-lyric__item--active");var e=120-24*n;i.$lyricList.animate({top:e},400)}})},MusicPlayer.prototype.playPause=function(){var i=this;this.$playPause.on("click",function(){i.audio.paused?i.audio.play():i.audio.pause()})},MusicPlayer.prototype.playStateChange=function(){var i=this;this.$audio.on("play",function(){i.$playPause.removeClass("icon-play").addClass("icon-pause"),i.$posterImg.css("animation-play-state","running")}),this.$audio.on("pause",function(){i.$playPause.removeClass("icon-pause").addClass("icon-play"),i.$posterImg.css("animation-play-state","paused")})},MusicPlayer.prototype.nextSong=function(){var i=this;this.$next.on("click",function(){i.audio.pause(),i.getSong()})},MusicPlayer.prototype.autoPlay=function(){var i=this;this.$audio.on("ended",function(){i.getSong()})},MusicPlayer.prototype.changeChannel=function(){var i=this;this.$channelsList.on("click","li",function(){i.audio.pause(),i.$playPause.removeClass("icon-pause").addClass("icon-play"),$(this).siblings().removeClass("c-channels-list__item--active"),$(this).addClass("c-channels-list__item--active"),i.channelId=$(this).attr("data-channel_id"),i.channelName=$(this).attr("data-channel_name"),i.getSong()})},MusicPlayer.prototype.showLyric=function(){var i=this;this.$lyricBtn.on("click",function(){"none"!==i.$lyric.css("display")?(window.innerWidth<768&&i.poster.fadeIn(),i.$lyric.fadeOut(),i.$lyricBtn.removeClass("c-setting__lyric--active")):(window.innerWidth<768&&i.poster.fadeOut(),i.$lyric.fadeIn(),i.$lyricBtn.addClass("c-setting__lyric--active"))})},MusicPlayer.prototype.showChannelsList=function(){var i=this;this.$channelBtn.on("click",function(t){t.stopPropagation(),"none"!==i.$channelsList.css("display")?(i.$channelsList.fadeOut(),i.$channelBtn.removeClass("icon-cross").addClass("icon-menu")):(i.$channelsList.fadeIn(),i.$channelBtn.removeClass("icon-menu").addClass("icon-cross"))}),$("body").on("click",function(){i.$channelsList.fadeOut(),i.$channelBtn.removeClass("icon-cross").addClass("icon-menu")})},MusicPlayer.prototype.setTime=function(){var i=this;this.$audio.on("durationchange",function(){i.totalTime=i.audio.duration,console.log(i.audio.duration);var t=i.formatTime(i.totalTime);i.$totalTime.text(t)}),setInterval(function(){i.curTime=i.audio.currentTime;var t=i.formatTime(i.curTime);i.$curTime.text(t);var n=i.$baseBar.width(),e=n*(i.curTime/i.totalTime);console.log(i.audio.duration),i.$curBar.width(e)},500)},MusicPlayer.prototype.formatTime=function(i){var t=parseInt(i),n=parseInt(t/60),e=parseInt(t%60);return e<10&&(e="0"+e),n+" : "+e},MusicPlayer.prototype.changeProgress=function(){var i=this;this.$baseBar.on("click",function(t){var n=t.clientX,e=$(this).offset().left,s=n-e;i.audio.currentTime=i.totalTime*s/i.$baseBar.width(),i.$curBar.width(s)})},MusicPlayer.prototype.setMute=function(){var i=this;this.$volumeBtn.on("click",function(){i.audio.volume?(i.audio.volume=0,i.$volumeBtn.removeClass("icon-volume").addClass("icon-mute")):(i.audio.volume=i.volume,i.$volumeBtn.removeClass("icon-mute").addClass("icon-volume")),console.log(i.audio.volume)})},MusicPlayer.prototype.changeVolume=function(){var i=this;this.$curVolume.width(100*i.audio.volume+"%"),this.$basicVolume.on("click",function(t){var n=t.clientX,e=$(this).offset().left,s=n-e;i.audio.volume=1*s/i.$basicVolume.width(),i.volume=i.audio.volume,console.log(i.audio.volume),i.$curVolume.width(s),i.$volumeBtn.hasClass("icon-mute")&&i.$volumeBtn.removeClass("icon-mute").addClass("icon-volume")})};