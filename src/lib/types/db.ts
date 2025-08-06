export type User = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
  displayName: string | null;
  gender: "male" | "female" | "other" | null;
  intro: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
};

export type Chat = {
  id: string;
  userId1: string;
  userId2: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

export type UserShow = User & {
  image: string | null;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Event = {
  title: string;
  description: string | null;
  type: "public" | "private" | null;
  startTime: Date;
  endTime: Date;
  label: string | null;
  position: LatLng;
};

export type EventShow = Event & {
  id: number;
};
