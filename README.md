# BUGS
- youtube search result format flip flop ???
- video visibility - youtube on load

- github login
- expand contract - redirect to login check authenticated paths

- login system issues
	- redirect to failing page after refresh login 


# TODO
- continuous auto import with UI feedback
- remove userid parameter from requests, use req.user from passport in express routes
- feature/suggestion boxes (single view in list)

# EASY
- edit playlist title
- search playlists
- search tags
- play all button
- show source everywhere (playlist, history, search results) ie FMA, jamendo, youtube, local, ..


# NEXT
- movies/video
	- UI like others
	- import routine extract meta from FS paths + XML files.
- chromecast
- voice app using jovo and hermod

# ONE DAY
- share playlist
- blocks - by tag, artist, track
	- block buttons
	- UI showing block filters (advanced search)
	- server side implement filters
- error message handler
- config from ENV for docker
- per track access controls - public, user + groups ?
- restore autoscroll ??
	- to top on mount 
		- playlists
- click home scroll to top ??

- fma/jamendo restore live search as well as library tracks.
- fma download full archive
- archive.org API + scrape
- profile page stats
	- tracks played
	- genres
	- ...
	- what other capture to support reporting ?
- db paging to support infinite list
- improve continue play on fail .

- VOICE



# DONE
- sort by least number of tags



http://www.baroquemusic.org/49Web.html

http://www.blockmrecords.org/bach/

http://www.saladelcembalo.org/index.htm
https://www.welltemperedclavier.org/
https://soniventorum.com/soniventorum_archives.html
https://imslp.org/wiki/Category:Recordings
http://www.rediscovery.us/index.html
https://musopen.org/.

https://github.com/mkiol/Snipek - CPP snips audio server for linux/osx


https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/
https://github.com/gabrielpoca/browser-pcm-stream


https://github.com/mattdiamond/Recorderjs/issues/186


https://github.com/GoogleChromeLabs/audioworklet-polyfill


https://andyfelong.com/2016/01/mongodb-3-0-9-binaries-for-raspberry-pi-2-jessie/


https://medium.com/@smashingmag/keeping-node-js-fast-tools-techniques-and-tips-for-making-high-performance-node-js-servers-8cfcb55e3d7


INSTALL

git clone ...

# npm install
docker stop syn; docker rm syn; docker run --name syn -it -v /home/pi/meekamusic:/usr/src/app  --entrypoint /bin/bash syntithenai/meeka  

docker-compose -f docker-compose.???.yml   (pi local ..)
