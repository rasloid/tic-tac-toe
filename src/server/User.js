const createUser = (nickname,socketId) => ({
        nickname:nickname,
        socketId : socketId,
        sentRequestTo : null,
        receivedRequestFrom: null,
        gameId: null,
        opponentNickname: null,
        resumeGameAccept:false
});

