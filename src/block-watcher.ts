import { HeaderRepository } from "./context/header-repository";

class BlockWatcher {
  private _repository!: HeaderRepository;
  private _callbacks!: ((height: number) => void)[];
  private _lastBlockHeight!: number;
  private _timer!: NodeJS.Timeout;

  constructor() {
    this._callbacks = [];
    this._lastBlockHeight = 0;
  }

  public onNewBlock(callback: (height: number) => void): BlockWatcher {
    if (!callback) {
      return this;
    }

    this._callbacks.push(callback);
    return this;
  }

  public removeOnNewBlockListener(callback: (height: number) => void): void {
    const index = this._callbacks.indexOf(callback);
    if (index > -1) {
      this._callbacks = this._callbacks.splice(index, 1);
    }
  }

  public start(repository: HeaderRepository, interval = 5): BlockWatcher {
    this._repository = repository;
    if (this._timer) {
      clearInterval(this._timer);
    }

    this._timer = setInterval(() => this._startBlockWatcher(this._repository), interval * 1000);
    return this;
  }

  private _notify(height: number) {
    this._callbacks.forEach((callback) => callback(height));
  }

  private _startBlockWatcher(repository: HeaderRepository) {
    repository.getMaxHeight().then((height) => {
      if (!height || this._lastBlockHeight >= height) {
        return;
      }

      if (process.env.TS_NODE_DEV === "true") {
        console.log(`New block found: ${height}`);
      }

      this._lastBlockHeight = height;
      this._notify(height);
    });
  }
}

export const blockWatcher = new BlockWatcher();
