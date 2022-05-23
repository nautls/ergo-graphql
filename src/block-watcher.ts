import { Repository } from "typeorm";
import { appDataSource } from "./data-source";
import { HeaderEntity } from "./entities";

class BlockWatcher {
  private _repository!: Repository<HeaderEntity>;
  private _callbacks!: ((height: number) => void)[];
  private _lastBlockHeight!: number;
  private _timer!: NodeJS.Timeout;

  constructor() {
    this._repository = appDataSource.getRepository(HeaderEntity);
    this._callbacks = [];
    this._lastBlockHeight = 0;
  }

  private notify(height: number) {
    this._callbacks.forEach((callback) => callback(height));
  }

  public onNewBlock(callback: (height: number) => void) {
    if (!callback) {
      return;
    }

    this._callbacks.push(callback);
  }

  public removeOnNewBlockListener(callback: (height: number) => void) {
    const index = this._callbacks.indexOf(callback);
    if (index > -1) {
      this._callbacks = this._callbacks.splice(index, 1);
    }
  }

  public start(interval = 5) {
    if (this._timer) {
      clearInterval(this._timer);
    }

    this._timer = setInterval(() => this._startBlockWatcher(this._repository), interval * 1000);
  }

  private _startBlockWatcher(repository: Repository<HeaderEntity>) {
    repository
      .createQueryBuilder("header")
      .select("MAX(height)", "height")
      .getRawOne()
      .then(({ height }) => {
        if (this._lastBlockHeight >= height) {
          return;
        }

        console.log(`New block found: ${height}`);
        this._lastBlockHeight = height;
        this.notify(height);
      });
  }
}

export const blockWatcher = new BlockWatcher();
