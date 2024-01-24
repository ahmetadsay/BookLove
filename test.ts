export default function babyNameGenerator(nameIdeas: Array<string>, surnameIdeas: Array<string>): string {
  if (nameIdeas.length < 2 || surnameIdeas.length === 0) {
    return "";
  }

  const nameCombinations: string[] = [];

  for (const firstName of nameIdeas) {
    for (const middleName of nameIdeas) {
      for (const surname of surnameIdeas) {
        if (firstName !== middleName && firstName !== surname && middleName !== surname) {
          const nameCombination = [firstName, middleName, surname].sort().join(" ");
          nameCombinations.push(nameCombination);
        }
      }
    }
  }

  return nameCombinations.sort().join("\n");
}

// Input parameters: (["Ted","Alan",], ["Mosseria",])
// Result: Alan Mosseria Ted
// Alan Mosseria Ted
// Expected: Alan Ted Mosseria
// Ted Alan Mosseria
// ---------------------------------
// Input parameters: (["Tom","Jerry",], ["Cat","Mouse",])
// Result: Cat Jerry Tom
// Cat Jerry Tom
// Jerry Mouse Tom
// Jerry Mouse Tom
// Expected: Jerry Tom Cat
// Jerry Tom Mouse
// Tom Jerry Cat
// Tom Jerry Mouse
// ---------------------------------
// Input parameters: (["Fulano","Dave","Dave",], ["De Los Santos",])
// Result: Dave De Los Santos Fulano
// Dave De Los Santos Fulano
// Dave De Los Santos Fulano
// Dave De Los Santos Fulano
// Expected: Dave Fulano De Los Santos
// Fulano Dave De Los Santos

