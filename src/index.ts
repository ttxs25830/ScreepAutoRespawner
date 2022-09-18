import { ScreepsAPI } from "screeps-api";

const api = new ScreepsAPI({
  token: "607083fc-90ac-4119-84ec-399e8bc27285",
  protocol: "https",
  hostname: "screeps.com",
  port: 443,
  path: "/",
});
const liveingShard = "shard3";
let findedRespawnRoom: null | {
  room: string;
  x: number;
  y: number;
} = null;
const circleTime = 0;
const minAllowSource = 2;
let sourceTick = -1;
let lastMainRuning = 0;
let mainRuning = false;
const stillSec = async (first: boolean = true) => {
  if(first) {
    await new Promise((r) => setTimeout(r, 5000))
  }
  if (sourceTick == -1 || first) {
    sourceTick = Number.parseInt(
      (await api.req("GET", "/api/auth/me"))["lastRespawnDate"],
      10
    );
  }
  const tmp = ((185000 - (Date.now() - sourceTick)) / 1000);
  return tmp < 0 ? 0 : tmp;
};
async function findRespawnRoom() {
  await api.socket.connect();
  const findedList: string[] = [];
  let res: null | string = null;
  const scanFunc = async () => {
    while (true) {
      if (res !== null) {
        break;
      }
      const room = (
        await api.req("GET", "/api/game/random-novice-room", {
          shard: liveingShard,
        })
      )["room"];
      if (findedList.indexOf(room) != -1) {
        continue;
      } else {
        findedList.push(room);
      }
      console.log(`Scaning ${room}...`);
      const status = (await new Promise((res) => {
        api.socket.subscribe(`room:${liveingShard}/${room}`, (d: any) => {
          api.socket.unsubscribe(`room:${liveingShard}/${room}`);
          res(d.data.objects);
        });
      })) as { [index: string]: { type: string; user?: string } };
      let sourceCount = 0;
      for (let i in status) {
        if (status[i].type == "source") {
          sourceCount++;
        }
      }
      if (sourceCount >= minAllowSource) {
        res = room;
        break;
      } else {
        console.log(`Room ${room} refused(only ${sourceCount} sources)`);
      }
    }
  };
  await Promise.all(Array(4).fill(scanFunc()));
  await api.socket.disconnect();
  const roomName = res as unknown as string;
  const terrain: {
    x: number;
    y: number;
    type: "wall" | "swamp";
  }[] = (
    await api.req("GET", "/api/game/room-terrain", {
      room: roomName,
      shard: liveingShard,
    })
  ).terrain;
  let pos: {
    x: number;
    y: number;
  } = {
    x: Math.floor(Math.random() * 48) + 1,
    y: Math.floor(Math.random() * 48) + 1,
  };
  while (
    terrain.find((v) => v.x == pos.x && v.y == pos.y && v.type == "wall") !==
    undefined
  ) {
    pos = {
      x: Math.floor(Math.random() * 48) + 1,
      y: Math.floor(Math.random() * 48) + 1,
    };
  }
  return {
    room: roomName,
    x: pos.x,
    y: pos.y,
  };
}
async function startRespawnProcess(status: "lost" | "empty" = "lost") {
  if (status == "lost") {
    // Send respawn request
    await api.req("POST", "/api/user/respawn");
    // Fetch respawn time
    console.log(`Respawn start cooldown!(${await stillSec(true)}s left)`);
  }
  // Reset memory
  await api.req("POST", "/api/user/memory", {
    path: "",
    value: { creeps: {}, flags: {}, rooms: {}, spawns: {} },
    shard: liveingShard,
  });
  console.log(`Memory reset!(${await stillSec()}s left)`);
  console.log("Finding respawn place...");
  // Find respawn room
  findedRespawnRoom = await findRespawnRoom();
  console.log(`Find target respawn room ${findedRespawnRoom?.room}`);
  console.log(`Still ${await stillSec()}s left, scan in every 30s`);
}
async function main() {
  if (Date.now() - lastMainRuning < circleTime || mainRuning) {
    return;
  }
  mainRuning = true;
  console.log("-----" + Date() + "-----");
  console.log("Checking...");
  switch ((await api.req("GET", "/api/user/world-status"))["status"]) {
    // Bot running as normal
    case "normal":
      console.log("Normaly runing!");
      console.log("Nothing to do...");
      break;
    case "lost":
      console.log("You lost all the spawns!");
      console.log("Starting respawn process...");
      await startRespawnProcess();
      break;
    case "empty":
      console.log("You are in respawn cooldown!");
      if (!findedRespawnRoom) {
        console.log("Loading respawn process");
        await startRespawnProcess("empty");
      }
      if ((await stillSec()) > 0) {
        console.log(`Respawn cooldown in ${await stillSec()}s, waiting...`);
      } else {
        console.log("Respawn cooldown finnshed");
        console.log(
          `Respawn with room:${findedRespawnRoom?.room}, x:${findedRespawnRoom?.x}, y:${findedRespawnRoom?.y}`
        );
        await api.req("POST", "/api/game/place-spawn", {
          shard: liveingShard,
          room: findedRespawnRoom?.room,
          x: findedRespawnRoom?.x,
          y: findedRespawnRoom?.y,
          name: `${findedRespawnRoom?.room}-Spawn1`,
        });
        console.log(`Respawned!`);
        findedRespawnRoom = null;
        sourceTick = -1;
        console.log("Back to normal");
      }
      break;
  }
  lastMainRuning = Date.now();
  mainRuning = false;
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
