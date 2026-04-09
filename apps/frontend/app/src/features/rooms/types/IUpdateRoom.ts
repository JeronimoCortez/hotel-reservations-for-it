import type { ICreateRoom } from "./ICreateRoom";

export interface IUpdateRoom extends Partial<ICreateRoom> {
  inService?: boolean;
}
