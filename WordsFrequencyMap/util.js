function textToFrequencyMap(text, customFilter) {
  const result = {};

  text.split(' ').forEach(splitedText => {
    wordToFilteredWordsArray(splitedText).forEach(word => {
      if (!word) {
        return;
      }

      if (customFilter && customFilter.indexOf(word.toLowerCase()) !== -1) {
        return;
      }

      if (result[word]) {
        result[word]++;
      } else if (word) {
        result[word] = 1;
      }
    });
  });

  return result;
}

function frequencyMapToSortedArray(map) {
  const result = [];
  const wordsArray = Object.keys(map);
  const maxFrequency = Object.values(map).reduce((maxFrequency, frequency) => (frequency > maxFrequency ? frequency : maxFrequency), 0);
  const levelUnit = maxFrequency / 5;

  for (let i = 0; i < wordsArray.length; i++) {
    if (result.length >= 100) {
      break;
    }

    const item = {
      word: wordsArray[i],
      frequency: map[wordsArray[i]],
    };

    item.level = Math.round(item.frequency / levelUnit);

    if (i === 0) {
      result.push(item);
    } else {
      for (let j = 0; j < result.length; j++) {
        if (result[j].frequency > item.frequency) {
          continue;
        } else {
          result.splice(j, 0, item);
          break;
        }
      }
    }
  }

  return result;
}

function wordToFilteredWordsArray(word) {
  let filteredWord = word.replace(/[^A-Za-z]+/g, ' ').trim();

  return filteredWord.split(' ');
}
