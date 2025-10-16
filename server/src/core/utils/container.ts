import { Logger } from "./logger";

interface Dependencies {
  logger: Logger;
}

class Container {
  private static instance: Container;
  private dependencies: Partial<Dependencies> = {};

  private constructor() {
    this.dependencies.logger = Logger.getInstance();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public get<K extends keyof Dependencies>(Key: K): Dependencies[K] {
    const dependency = this.dependencies[Key];
    if (!dependency) {
      throw new Error(`Dependency ${Key} not found`);
    }
    return dependency;
  }

  public set<K extends keyof Dependencies>(
    Key: K,
    dependency: Dependencies[K]
  ): void {
    this.dependencies[Key] = dependency;
  }
}

export default Container;
