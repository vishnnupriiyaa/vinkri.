// Audio manager - muted / disabled per user request
class SoundManager {
  public enabled: boolean = false;

  playClick() {
    // Sound disabled
  }

  playChime() {
    // Sound disabled
  }

  playDoorBell() {
    // Sound disabled
  }
}

export const sound = new SoundManager();
