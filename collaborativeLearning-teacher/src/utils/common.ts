import { LoadingPlugin } from 'tdesign-vue-next'

export const loadingState = (item: any) => {
  LoadingPlugin({
    attach: `#${item}`,
    showOverlay: true
  })
}

export const timeStamp2time = (timestamp: string) => {
  if (timestamp) {
    let now = new Date(timestamp)
    let y = now.getFullYear()
    let m = now.getMonth() + 1
    let d = now.getDate()
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8)
  } 
}

export const getRealLength = (text: any) => {
  let len = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i].match(/[^\x00-\xff]/ig) != null) //全角 
      len += 2 //如果是全角，占用两个字节
    else
      len += 1 //半角占用一个字节
  }
  return len
}

export const getFormedTime = (secondsValue: any) => {
  let hours = Math.floor(secondsValue / 3600);
  let minutes = Math.floor((secondsValue % 3600) / 60);
  let secs = secondsValue % 60;
  return [hours, minutes, secs]
}

export const getFormedTimeForList = (val: any) => {
  let timepart = val.split(':')[0].split('s ~ ')
  let otherpart = val.split(':')[1]
  console.log(timepart)
  let startTime = secondsToHms(timepart[0])
  let endTime = secondsToHms(timepart[1].slice(0, -2))

  if (startTime.split(':')[0] == '00') {
    startTime = startTime.slice(3)
  }
  if (endTime.split(':')[0] == '00') {
    endTime = endTime.slice(3)
  }
  return startTime + ' ~ ' + endTime + ' : ' + otherpart
}

const secondsToHms = (sec: any) => {
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec % 3600) / 60);
  let seconds = sec % 60;
 
  return [hours, minutes, seconds]
    .map(num => num < 10 ? '0' + num : num)
    .filter(Boolean)
    .join(':');
}

export const pngUrl = (name: string) => {
  return `https://image-u-hk.oss-cn-hongkong.aliyuncs.com/onlineclass/${name}.png`
}

export const jpgUrl = (name: string) => {
  return `https://image-u-hk.oss-cn-hongkong.aliyuncs.com/onlineclass/${name}.jpg`
}