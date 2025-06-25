

export interface ErrorsDict {
    FailedToBuzzIn: string;
    FailedToGetQueue: string;
    FailedToEmptyQueue: string;
    FailedToPopQueue: string;
    FailedToUpdateScore: string;
    FailedToLoadQuestions: string;
    connectionError: string;
    noPlayersInQueue: string;
    noPlayersInLeaderboard: string;
    UnknownPlayer: string;
    playerRemoved: string;
    failedToGetStatus: string;
    gameEndedRedirect: string;
    failedToEndGame: string;
    dangerAlert: string;
    warningAlert: string;
    FailedToUpdateQueueStatus: string;
    FailedToUpdatePlayerStatus: string;
    FailedToFetchPlayerCount: string;
    FailedToGetLeaderboard: string;
    LeaderboardNotFound: string;
    LeaderboardIsEmpty: string;
    PlayerNotInLeaderboard: string;
    FailedToKickPlayer: string;
    FailedToEndGameApi: string;
    InternalServerError: string;
    roomCodeError: string;
    noMoreQuestions: string;


}

export interface Dict {
    buzzerQueue: string;
    theWinnerIs: string;
    appName: string;
    language: string;
    welcome: string;
    joinGame: string;
    leaderboard: string;
    testYourKnowledge: string;
    pageNotFound: string;
    oops: string;
    returnHome: string;
    joinRoom: string;
    yourName: string;
    enterYourName: string;
    roomCode: string;
    enterRoomCode: string;
    dismiss: string;
    createGame: string;
    refreshPage: string;
    correctAnswer: string;
    wrongAnswer: string;
    skipQuestion: string;
    players: string;
    round: string;
    question: string;
    answer: string;
    goHome: string;
    endGame: string;
    kick: string;
    action: string;
    score: string;
    name: string;
    successAlert: string;
    createdBy: string;
    joinLeaderboard: string;
    yourRoomId: string;
    leaderboardTitle: string;
    points: string;
    gameSettings: string;
    yes: string;
    no: string;
    endGameConfirmation: string;
    kickConfirmation: string;
    backConfirmation: string;
    connecting: string;
    buzzing: string;
    yourTurn: string;
    waiting: string;
    buzzIn: string;
    alialwahayb: string;
    errors: ErrorsDict;
}
