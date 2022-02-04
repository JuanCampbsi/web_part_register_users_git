import * as React from 'react';
import { IHomeDevProps } from './IHomeDevProps';
import { App } from './AppForm/App';

export default class HomeDev extends React.Component<IHomeDevProps, {}> {
  public render(): React.ReactElement<IHomeDevProps> {
    return (
      <div>
        <App />
      </div>
    );
  }
}
