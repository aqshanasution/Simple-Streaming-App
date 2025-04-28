function searchYouTube() {
    var searchQuery = $('#searchInput').val();
    if (searchQuery !== '') {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search',
            method: 'GET',
            data: {
                part: 'snippet',
                q: searchQuery,
                type: 'video',
                maxResults: 20, // Jumlah hasil pencarian yang diinginkan
                key: 'YOUTUBE API KEY' // Ganti dengan kunci API YouTube Anda
            },
            success: function(data) {
                if (data.items.length > 0) {
                    var videoId = data.items[0].id.videoId;
                    var videoUrl = 'https://www.youtube.com/embed/' + videoId;
                    $('#videoPlayer').attr('src', videoUrl);

                    // Tampilkan daftar video terkait
                    displayRelatedVideos(data.items.slice(1));

                    // Dapatkan informasi channel
                    getChannelInfo(data.items[0].snippet.channelId);
                } else {
                    alert('Video tidak ditemukan.');
                }
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    } else {
        alert('Masukkan kata kunci pencarian.');
    }
}

function displayRelatedVideos(videos) {
    var videoList = $('#videoList');
    videoList.empty();

    videos.forEach(function(video) {
        var videoItem = $('<li class="video-list-item">');
        var videoLink = $('<a href="#" onclick="playRelatedVideo(\'' + video.id.videoId + '\')"></a>');
        var thumbnailUrl = video.snippet.thumbnails.medium.url;
        var videoThumbnail = $('<img class="video-thumbnail" src="' + thumbnailUrl + '" alt="Video Thumbnail">');
        var videoTitle = $('<p>' + video.snippet.title + '</p>');
        videoLink.append(videoThumbnail);
        videoLink.append(videoTitle);
        videoItem.append(videoLink);
        videoList.append(videoItem);
    });
}

function playRelatedVideo(videoId) {
    var videoUrl = 'https://www.youtube.com/embed/' + videoId;
    $('#videoPlayer').attr('src', videoUrl);
}

function getChannelInfo(channelId) {
    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/channels',
        method: 'GET',
        data: {
            part: 'snippet',
            id: channelId,
            key: 'YOUTUBE API KEY' // Ganti dengan kunci API YouTube Anda
        },
        success: function(data) {
            if (data.items.length > 0) {
                displayChannelInfo(data.items[0].snippet);
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}

function displayChannelInfo(channel) {
    var channelInfo = $('#channelInfo');
    channelInfo.empty();

    var channelTitle = $('<h2>' + channel.title + '</h2>');
    var channelThumbnail = $('<img class="video-thumbnail" src="' + channel.thumbnails.medium.url + '" alt="Channel Thumbnail">');
    var channelDescription = $('<p>' + channel.description + '</p>');

    channelInfo.append(channelTitle);
    channelInfo.append(channelThumbnail);
    channelInfo.append(channelDescription);
}
