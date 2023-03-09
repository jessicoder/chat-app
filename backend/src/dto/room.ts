export interface RoomDto {
  roomName?: string;
  roomType?: boolean;
  createdBy?: string;
  userIDs?: Array<string>;
  blockIDs?: Array<string>;
}
