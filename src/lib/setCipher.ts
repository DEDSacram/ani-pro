import * as popis from '../popis.json';
import { drawPoint } from './createCaesarWheel';

export function setPlayfair(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return function GenerateStepsPlayfair(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number) {
      let ss = []
      let sa = []
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        // same row
        let descript = ""

        descript += display[aniarray[i][0][0][0]][aniarray[i][0][0][1]] + display[aniarray[i][1][0][0]][aniarray[i][1][0][1]] + "->" + display[aniarray[i][0][1][0]][aniarray[i][0][1][1]] + display[aniarray[i][1][1][0]][aniarray[i][1][1][1]] + " "
        if (aniarray[i][0][0][0] == aniarray[i][1][0][0]) {
          if (encrypttext) {
            descript += popis.r + popis.each + popis.by + "1 " + popis.right
          } else {
            descript += popis.r + popis.each + popis.by + "1 " + popis.left
          }
        }
        //same column
        else if (aniarray[i][0][0][1] == aniarray[i][1][0][1]) {
          if (encrypttext) {
            descript += popis.c + popis.each + popis.by + + "1 " + popis.down
          } else {
            descript += popis.c + popis.each + popis.by + "1 " + popis.up
          }
        }
        //different row and column
        else {
            descript += popis.drc + popis.each + popis.hr
        }
        ss.push(descript)


        for (let j = 0; j < aniarray[i].length; j++) {
          let letter = []

          for (let z = 0; z < aniarray[i][j].length; z++) {
            letter.push([aniarray[i][j][z][1] * spacexby, aniarray[i][j][z][0] * spaceyby])
          }
          step.push(letter)
        }



        sa.push(step)
        
      }
      daobj.animationsteps = sa
      daobj.savedsteps = ss

    }

  }

export function setCaesar(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return function GenerateStepsCaesar(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number,ctx : any,by : number) {
      let ss = []
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        for (let j = 0; j < aniarray[i][0].length; j++) {
          let microstep = [aniarray[i][0][j][0] * spacexby, aniarray[i][0][j][1] * spaceyby]
          step.push(microstep)
        }

        let descript = ""
        descript += display[aniarray[i][0][0][0]] + "->" + display[aniarray[i][0][1][0]] + " "
        if(encrypttext){
          descript += popis.mo + popis.by+ by + " " + popis.right
        }else{
          descript += popis.mo + popis.by+ by + " " + popis.left
        }


        ss.push(descript)
        daobj.animationsteps.push([step])
      }
      daobj.savedsteps = ss
    }
  }

export function setHomo(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return function GenerateStepsHomo(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number) {
      let ss = []
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        for (let j = 0; j < aniarray[i][0].length; j++) {
          let microstep = [aniarray[i][0][j][0] * spacexby, aniarray[i][0][j][1] * spaceyby]
          step.push(microstep)
        }
        let descript = ""
        let ind = aniarray[i][0][0][0]
        for (const key in display) {
          
          if(ind == 0){
            console.log(aniarray[i][0][1])
            descript += key + "->" + display[key][aniarray[i][0][1][1]-1] + " "
            break;
          }
          ind--
        }
      
        
        // if(encrypttext){
        //   descript += popis.mo + popis.by + " " + popis.right
        // }else{
        //   descript += popis.mo + popis.by + " " + popis.left
        // }
        ss.push(descript)

        daobj.animationsteps.push([step])
      }
      daobj.savedsteps = ss
    }
  }
export function setCaesarCircle(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return async function GenerateStepsCaesar(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number,ctx : any,by : number) {
    //override
    let dis = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    let ss = []

    let radius = ctx.canvas.clientHeight / 2
    let cpoint
    let microstep
    for (let i = 0; i < aniarray.length; i++) {
      let step = []
        let rotatedby = by*13.84
        if(encrypttext){
          rotatedby = -rotatedby
        }
        cpoint = drawPoint(rotatedby +(13.84 * -aniarray[i][0][0][0] +6*13.84 + 13.84/2), 0.80, radius)
        microstep = [cpoint.circx, cpoint.circy]
        step.push(microstep)
        cpoint = drawPoint(rotatedby + (13.84 * -aniarray[i][0][0][0] + 6*13.84 + 13.84/2), 0.65, radius)
        microstep = [cpoint.circx, cpoint.circy]
        step.push(microstep)

        let descript = ""
        descript += display[aniarray[i][0][0][0]] + "->" + display[aniarray[i][0][1][0]] + " "
        if(encrypttext){
          descript += popis.mo + popis.by+ by + " " + popis.right
        }else{
          descript += popis.mo + popis.by+ by + " " + popis.left
        }
        ss.push(descript)

      daobj.animationsteps.push([step])
    }
    daobj.savedsteps = ss
  }
}