const musicExts = [".mp3",".wav",".flac"]
        let playlistItems = [];
        let imgEntity
        currentIndex = 0

        async function selectFolder() {
            const folderHandle = await window.showDirectoryPicker();
            const playlist = document.getElementById('playlist');
            playlist.innerHTML = ''; // プレイリストをリセット

            playlistItems = [];

            const sortedEntries = [];
            
            for await (const entry of folderHandle.values()) {
                if (entry.kind === 'file'){
                    if(musicExts.some(extension => (entry.name).endsWith(extension))) {
                        sortedEntries.push(entry);
                    }
                    if((entry.name).startsWith("albumArt")) {
                        imgEntry = entry;
                    }
                }
            }

            sortedEntries.sort((a, b) => a.name.localeCompare(b.name));

            for (const entry of sortedEntries) {
                const listItem = document.createElement('li');
                listItem.textContent = entry.name;
                listItem.addEventListener('click', () => playMusic(entry));
                playlist.appendChild(listItem);

                // プレイリストのアイテムにelementプロパティを追加してDOM要素を追跡
                playlistItems.push({
                    fileHandle: entry,
                    element: listItem
                });
            }

            if (playlistItems.length > 0) {
                // 最初の曲を再生
                playMusic(playlistItems[currentIndex].fileHandle);
            }
        }

        async function playMusic(fileHandle) {
            const audioPlayer = document.getElementById('audioPlayer');

            currentIndex = playlistItems.findIndex(item => item.fileHandle.name === fileHandle.name);

            // 全ての曲から 'playing' クラスを削除
            playlistItems.forEach(item => item.element.classList.remove('playing'));

            // 再生中の曲を強調表示
            playlistItems[currentIndex].element.classList.add('playing');

            const file = await fileHandle.getFile();
            audioPlayer.src = URL.createObjectURL(file);
            audioPlayer.play();
        }

        function playNext() {
            const audioPlayer = document.getElementById('audioPlayer');
            currentIndex = (currentIndex + 1) % playlistItems.length;
            playMusic(playlistItems[currentIndex].fileHandle);
        }

        function playPrevious() {
            const audioPlayer = document.getElementById('audioPlayer');
            currentIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
            playMusic(playlistItems[currentIndex].fileHandle);
        }
        
        audioPlayer.addEventListener('ended', playNext);