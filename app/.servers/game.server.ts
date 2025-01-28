import { createMachineServer } from "actor-kit/worker";
import { gameMachine } from "~/machines/game.machine";
import {
  GameClientEventSchema,
  GameServiceEventSchema,
  GameInputPropsSchema,
} from "~/schemas/game.schema";

export const Game = createMachineServer({
  machine: gameMachine,
  schemas: {
    clientEvent: GameClientEventSchema,
    serviceEvent: GameServiceEventSchema,
    inputProps: GameInputPropsSchema,
  },
  options: {
    persisted: true,
  },
});

export type GameServer = InstanceType<typeof Game>;
export default Game; 