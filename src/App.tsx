import React, { Component } from 'react';
import PropTypes from 'prop-types'
import io from 'socket.io-client'
import styles from './index.module.scss';
import SearchInput from './components/SearhInput'
import ResultList from './components/ResultList'
import PageDetail from './components/PageDetail'
import { GlobalContext } from './Container'
import { requestType, viewState, listState } from './types/enums';

export type socketSend = (type: requestType, payload?: STServer.requestData) => any;

interface socketMethod {
  socketSend: socketSend,
  processSocketMsg: ({ state, data }: STServer.response) => any
}

class App extends Component implements socketMethod {
  public static contextType = GlobalContext;
  context!: React.ContextType<typeof GlobalContext>;
  private socket: SocketIOClient.Socket
  constructor(props: any) {
    super(props);

    this.socket = io('http://localhost:8080');


    //socket io listeners
    this.socket.on('connect', () => {
      console.log('Client has connected to the server!');
    });

    this.socket.on('exit', (data: any) => {
      console.log(data);
    })

    this.socket.on('message', this.processSocketMsg);
  }
  processSocketMsg = ({ state, data }: STServer.response) => {

    if (state === undefined && data === undefined || !this.context) {
      return;
    }
    let {mainViewState} = this.context;
    let resultListStatus = this.context.resultList.state;

    if (state === 2) {
      mainViewState = viewState["list"];
      resultListStatus = listState["loading"];
    } else if (state === 3) {
      mainViewState = viewState["list"];
      resultListStatus = listState["hasnext"]
    } else if (state === 4) {
      mainViewState = viewState["detail"];
      resultListStatus = listState["none"]
      if (data) {
        this.context.updateResultDetail(data)
      }
    }

    //state为4时，data为对象
    if (state !== 4 && data && data.length > 0) {
      this.concatResultList(data);
    }


    this.context.updateViewState(mainViewState)

    this.context.updateResultList(undefined, resultListStatus);

  }
  concatResultList = (newList: STServer.resultList) => {

    if(!this.context || !newList) return;

    const resultList = [...this.context.resultList.value];
    
    newList.forEach(item => {
      const existItemIndex = resultList.findIndex(v => v.id === item.id);
      if (existItemIndex > -1) {
        resultList[existItemIndex] = item;
      } else {
        resultList.push(item);
      }
    })

    this.context.updateResultList(resultList)
  }

  socketSend = (type: requestType, payload?: STServer.requestData) => {
    /**
     * 发消息给服务端
     * 类型：
     * 1: 搜索
     * 2: 更多
     * 3: 返回搜索结果
     * 4: 进入结果详情
     * 5: 退出搜索
     */

    this.socket.emit("action", {
      type,
      payload
    });
  }
  render() {
    if(!this.context) return null;

    const { mainViewState } = this.context;
    return (
      <div className={`${styles.App} PageStatus-${mainViewState}`}>
        <SearchInput socketSend={this.socketSend} />
        {
          mainViewState === viewState['none']
          ?
          null
          :
          mainViewState === viewState['list']
          ?
          <ResultList socketSend={this.socketSend} />
          :
          <PageDetail socketSend={this.socketSend} />
        }
      </div>


    );
  }
}

export default App;
