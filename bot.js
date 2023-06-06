function set_score(score) { 
    var url = new URL(window.location.href);
    const searchParams = url.searchParams;
    token = searchParams.get("token"); 
    // TelegramGameProxy.shareScore()
    console.log("set_score");
    fetch('http://35.232.104.60:7030/telegram/set_game_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: token,
            score: score,
        })
    }).then(res => {
        // console.log(res)
    })
}
function share_score() {
    console.log("share_score");
    TelegramGameProxy.shareScore()
}
function set_and_share_score(score) {
    share_score()
    set_score(score)
}
window.bot = {
    set_score: set_score,
    share_score: share_score,
    set_and_share_score: set_and_share_score,
}