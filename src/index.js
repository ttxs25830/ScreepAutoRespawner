"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var screeps_api_1 = require("screeps-api");
var api = new screeps_api_1.ScreepsAPI({
    token: "607083fc-90ac-4119-84ec-399e8bc27285",
    protocol: "https",
    hostname: "screeps.com",
    port: 443,
    path: "/"
});
var liveingShard = "shard3";
var findedRespawnRoom = null;
var circleTime = 0;
var minAllowSource = 2;
var sourceTick = -1;
var lastMainRuning = 0;
var mainRuning = false;
var stillSec = function (first) {
    if (first === void 0) { first = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, tmp;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!first) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 5000); })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    if (!(sourceTick == -1 || first)) return [3 /*break*/, 4];
                    _b = (_a = Number).parseInt;
                    return [4 /*yield*/, api.req("GET", "/api/auth/me")];
                case 3:
                    sourceTick = _b.apply(_a, [(_c.sent())["lastRespawnDate"],
                        10]);
                    _c.label = 4;
                case 4:
                    tmp = ((185000 - (Date.now() - sourceTick)) / 1000);
                    return [2 /*return*/, tmp < 0 ? 0 : tmp];
            }
        });
    });
};
function findRespawnRoom() {
    return __awaiter(this, void 0, void 0, function () {
        var findedList, res, scanFunc, roomName, terrain, pos;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.socket.connect()];
                case 1:
                    _a.sent();
                    findedList = [];
                    res = null;
                    scanFunc = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _loop_1, state_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _loop_1 = function () {
                                        var room, status_1, sourceCount, i;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (res !== null) {
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    return [4 /*yield*/, api.req("GET", "/api/game/random-novice-room", {
                                                            shard: liveingShard
                                                        })];
                                                case 1:
                                                    room = (_b.sent())["room"];
                                                    if (findedList.indexOf(room) != -1) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    else {
                                                        findedList.push(room);
                                                    }
                                                    console.log("Scaning ".concat(room, "..."));
                                                    return [4 /*yield*/, new Promise(function (res) {
                                                            api.socket.subscribe("room:".concat(liveingShard, "/").concat(room), function (d) {
                                                                api.socket.unsubscribe("room:".concat(liveingShard, "/").concat(room));
                                                                res(d.data.objects);
                                                            });
                                                        })];
                                                case 2:
                                                    status_1 = (_b.sent());
                                                    sourceCount = 0;
                                                    for (i in status_1) {
                                                        if (status_1[i].type == "source") {
                                                            sourceCount++;
                                                        }
                                                    }
                                                    if (sourceCount >= minAllowSource) {
                                                        res = room;
                                                        return [2 /*return*/, "break"];
                                                    }
                                                    else {
                                                        console.log("Room ".concat(room, " refused(only ").concat(sourceCount, " sources)"));
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [5 /*yield**/, _loop_1()];
                                case 2:
                                    state_1 = _a.sent();
                                    if (state_1 === "break")
                                        return [3 /*break*/, 3];
                                    return [3 /*break*/, 1];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, Promise.all(Array(4).fill(scanFunc()))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, api.socket.disconnect()];
                case 3:
                    _a.sent();
                    roomName = res;
                    return [4 /*yield*/, api.req("GET", "/api/game/room-terrain", {
                            room: roomName,
                            shard: liveingShard
                        })];
                case 4:
                    terrain = (_a.sent()).terrain;
                    pos = {
                        x: Math.floor(Math.random() * 48) + 1,
                        y: Math.floor(Math.random() * 48) + 1
                    };
                    while (terrain.find(function (v) { return v.x == pos.x && v.y == pos.y && v.type == "wall"; }) !==
                        undefined) {
                        pos = {
                            x: Math.floor(Math.random() * 48) + 1,
                            y: Math.floor(Math.random() * 48) + 1
                        };
                    }
                    return [2 /*return*/, {
                            room: roomName,
                            x: pos.x,
                            y: pos.y
                        }];
            }
        });
    });
}
function startRespawnProcess(status) {
    if (status === void 0) { status = "lost"; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!(status == "lost")) return [3 /*break*/, 3];
                    // Send respawn request
                    return [4 /*yield*/, api.req("POST", "/api/user/respawn")];
                case 1:
                    // Send respawn request
                    _k.sent();
                    // Fetch respawn time
                    _b = (_a = console).log;
                    _c = "Respawn start cooldown!(".concat;
                    return [4 /*yield*/, stillSec(true)];
                case 2:
                    // Fetch respawn time
                    _b.apply(_a, [_c.apply("Respawn start cooldown!(", [_k.sent(), "s left)"])]);
                    _k.label = 3;
                case 3: 
                // Reset memory
                return [4 /*yield*/, api.req("POST", "/api/user/memory", {
                        path: "",
                        value: { creeps: {}, flags: {}, rooms: {}, spawns: {} },
                        shard: liveingShard
                    })];
                case 4:
                    // Reset memory
                    _k.sent();
                    _e = (_d = console).log;
                    _f = "Memory reset!(".concat;
                    return [4 /*yield*/, stillSec()];
                case 5:
                    _e.apply(_d, [_f.apply("Memory reset!(", [_k.sent(), "s left)"])]);
                    console.log("Finding respawn place...");
                    return [4 /*yield*/, findRespawnRoom()];
                case 6:
                    // Find respawn room
                    findedRespawnRoom = _k.sent();
                    console.log("Find target respawn room ".concat(findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.room));
                    _h = (_g = console).log;
                    _j = "Still ".concat;
                    return [4 /*yield*/, stillSec()];
                case 7:
                    _h.apply(_g, [_j.apply("Still ", [_k.sent(), "s left, scan in every 30s"])]);
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (Date.now() - lastMainRuning < circleTime || mainRuning) {
                        return [2 /*return*/];
                    }
                    mainRuning = true;
                    console.log("-----" + Date() + "-----");
                    console.log("Checking...");
                    return [4 /*yield*/, api.req("GET", "/api/user/world-status")];
                case 1:
                    _a = (_e.sent())["status"];
                    switch (_a) {
                        case "normal": return [3 /*break*/, 2];
                        case "lost": return [3 /*break*/, 3];
                        case "empty": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 13];
                case 2:
                    console.log("Normaly runing!");
                    console.log("Nothing to do...");
                    return [3 /*break*/, 13];
                case 3:
                    console.log("You lost all the spawns!");
                    console.log("Starting respawn process...");
                    return [4 /*yield*/, startRespawnProcess()];
                case 4:
                    _e.sent();
                    return [3 /*break*/, 13];
                case 5:
                    console.log("You are in respawn cooldown!");
                    if (!!findedRespawnRoom) return [3 /*break*/, 7];
                    console.log("Loading respawn process");
                    return [4 /*yield*/, startRespawnProcess("empty")];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7: return [4 /*yield*/, stillSec()];
                case 8:
                    if (!((_e.sent()) > 0)) return [3 /*break*/, 10];
                    _c = (_b = console).log;
                    _d = "Respawn cooldown in ".concat;
                    return [4 /*yield*/, stillSec()];
                case 9:
                    _c.apply(_b, [_d.apply("Respawn cooldown in ", [_e.sent(), "s, waiting..."])]);
                    return [3 /*break*/, 12];
                case 10:
                    console.log("Respawn cooldown finnshed");
                    console.log("Respawn with room:".concat(findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.room, ", x:").concat(findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.x, ", y:").concat(findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.y));
                    return [4 /*yield*/, api.req("POST", "/api/game/place-spawn", {
                            shard: liveingShard,
                            room: findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.room,
                            x: findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.x,
                            y: findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.y,
                            name: "".concat(findedRespawnRoom === null || findedRespawnRoom === void 0 ? void 0 : findedRespawnRoom.room, "-Spawn1")
                        })];
                case 11:
                    _e.sent();
                    console.log("Respawned!");
                    findedRespawnRoom = null;
                    sourceTick = -1;
                    console.log("Back to normal");
                    _e.label = 12;
                case 12: return [3 /*break*/, 13];
                case 13:
                    lastMainRuning = Date.now();
                    mainRuning = false;
                    return [2 /*return*/];
            }
        });
    });
}
setInterval(main, 1000);
// new Promise((res) => {
//   api.socket.subscribe(`room:${"shard3"}/${"E7N6"}`, d => {
//     api.socket.unsubscribe(`room:${"shard3"}/${"E7N6"}`)
//     res(d.data.objects)
//   });
// }).then(d=>{
//   for(let i in d){
//     if(d[i].type == "controller"){
//       console.log(d[i])
//     }
//   }
// })
