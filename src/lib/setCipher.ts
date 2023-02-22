import * as popis from '../popis.json';

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

          if (encrypttext) {
            descript += popis.drc + popis.each + popis.hr
          } else {
            descript += popis.drc + popis.each + popis.hr
          }
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
    return function GenerateStepsCaesar(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number) {
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        for (let j = 0; j < aniarray[i][0].length; j++) {
          let microstep = [aniarray[i][0][j][0] * spacexby, aniarray[i][0][j][1] * spaceyby]
          step.push(microstep)
        }
        daobj.animationsteps.push([step])
      }
    }
  }

export function setHomo(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return function GenerateStepsHomo(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number) {
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        for (let j = 0; j < aniarray[i][0].length; j++) {
          let microstep = [aniarray[i][0][j][0] * spacexby, aniarray[i][0][j][1] * spaceyby]
          step.push(microstep)
        }
        daobj.animationsteps.push([step])
      }
    }
  }

export function setCaesarCircle(daobj : {animationsteps : (number[][][])[],savedsteps : string[]}) {
    return async function GenerateStepsCaesar(aniarray : any,display : any,encrypttext : string,spacexby : number,spaceyby : number,ctx : any) {
    //   let radius = (backctx.canvas.clientHeight / 2) * yratio
      for (let i = 0; i < aniarray.length; i++) {
        let step = []
        for (let j = 0; j < aniarray[i][0].length; j++) {
          let microstep = [aniarray[i][0][j][0] * spacexby, aniarray[i][0][j][1] * spaceyby]
          step.push(microstep)
        }
        daobj.animationsteps.push([step])
      }
    }
  }