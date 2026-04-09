export interface Room {
  id: string;
  number: number;
  type: "single" | "double" | "suite";
  price: number;
  inService: boolean;
}
