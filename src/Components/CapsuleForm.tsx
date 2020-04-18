import React, { useState, useEffect } from 'react';
import SeasonField from './SeasonField';
import StyleField from './StyleField';
import NumberOfOutfitsField from './NumberOfOutfitsField';
import ColorsField from './ColorsField';
import PreferencesField from './PreferencesField';
import { Fields, Season, Style, NumberOfOutfits, Colors, Preferences, Clothing } from '../Enums';
import CWardrobe from './Wardrobe';

const server = process.env.SERVER || "http://localhost:3000" 
const frontEnd = window.location.origin

interface Error {
  error: string;
}

export type Wardrobe = [[Clothing, number, [Colors]]] | undefined;

interface Capsule {
  season: Season;
  style: Style;
  numberOfOutfits: NumberOfOutfits;
  colors: Colors[];
  preferences: Preferences[];
}

const CapsuleForm = () => {

  const [error, setError] = useState<Error | null>(null);
  const [wardrobe, setWardrobe] = useState<Wardrobe | null>(null);
  const [capsuleReady, setCapsuleReady] = useState<boolean>(false);
  const [capsule, setCapsule] = useState<Capsule>({
    season: "AutumnWinter" as Season,
    style: "Casual" as Style,
    numberOfOutfits: "From10to20" as NumberOfOutfits,
    colors: [],
    preferences: []
  })

  useEffect(() => {
    console.log("useEffect");
    checkURl(window.location);
  }, [])

  useEffect(() => {
    if (capsuleReady) {
      sendForm();
      setCapsuleReady(false);
    }
  }, [capsuleReady])

  const sendForm = async () => {
    const encodedRequest = btoa(JSON.stringify(capsule)).replace(/\//g, '_').replace(/\+/g, '-')
    const newWebPage: string = `${frontEnd}/#/${encodedRequest}`;

    try {
      const response = await fetch(`${server}/capsule/${encodedRequest}`, {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        }),
      })
      if (response.status !== 200) {
        console.log(`Status ${response.status}`);
        return false;
      }
      const responseBody = await response.text();
      if (!JSON.parse(responseBody).error) {
        window.location.replace(newWebPage);
        setWardrobe(JSON.parse(responseBody))
        setError(null);
        return response.ok;
      } else {
        setError(JSON.parse(responseBody).message);
        return false;
      }
    } catch (ex) {
      return false;
    }
  }

  const updateField = (field: Fields, value: any): any => {
    switch (field) {
      case Fields.Season:
        setCapsule({
          ...capsule,
          season: value as Season
        })
        break;
      case Fields.Style:
        setCapsule({
          ...capsule,
          style: value as Style
        })
        break;
      case Fields.NumberOfOutfits:
        setCapsule({
          ...capsule,
          numberOfOutfits: value as NumberOfOutfits
        })
        break;
      case Fields.Colors:
        setCapsule({
          ...capsule,
          colors: value as Colors[]
        })
        break;
      case Fields.Preferences:
        setCapsule({
          ...capsule,
          preferences: value as Preferences[]
        })
        break;
      default:
        return
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    setWardrobe(null);
    setCapsuleReady(true);
  }

  const checkURl = async (webPage: any) => {
    const encodedCapsule = webPage.hash.slice(2);
    if (encodedCapsule.length > 0) {
      const decodedCapsule = JSON.parse(atob(encodedCapsule.replace(/_/g, '/').replace(/-/g, '+')));
      setCapsule(decodedCapsule);
      console.log("decodedCapsule: ", decodedCapsule);
      console.log("capsule before submitting", capsule);
      setCapsuleReady(true);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="container flex flex-row flex-wrap justify-around mw9 content-center center ph4-ns " >
          <div className="box ba tc bg-black-10 w-100 w-30-l br4 pa4 ma2">
            <SeasonField selectedSeason={capsule.season} updateField={updateField} />
            </div>
          <div className="box ba tc bg-black-10 w-100 w-30-l br4 pa4 ma2">
            <StyleField selectedStyle={capsule.style} updateField={updateField} />
          </div>
          <div className="box ba tc bg-black-10 w-100 w-30-l br4 pa4 ma2">
            <NumberOfOutfitsField selectedNumberOfOutfits={capsule.numberOfOutfits} updateField={updateField} />
          </div>
          <div className="box ba tc bg-black-10 w-100 w-30-l br4 pa4 ma2">
              <PreferencesField selectedPreferences={capsule.preferences} updateField={updateField} />
          </div>
          <div className="box ba tc bg-black-10 w-100 w-60-l  br4 pa4 ma2">
            <ColorsField selectedColors={capsule.colors} updateField={updateField} />
          </div>
        </ div>
        <div className="tc">
          {error
            ? <div className="error tc ba b--dark-red bg-light-red white pv1 ph1 dib-ns ma3 center ">
              {error}
            </div >
            : <br />
          }
        </div>
        <br />
        <div className="tc" >
          <button type="submit" className="bw0 br2 bg-gray pv2 ph3 white fw5 tc ttu tracked bg-animate hover-bg-dark-gray shadow-5">
            Check your new Capsule Wardrobe!
          </button>
        </div>
      </form>
      <br />
      <div className="container flex" >
              {wardrobe
        ? <CWardrobe wardrobe={wardrobe} />
        : <br />
      }
      </div>
    </div>
  )
}

export default CapsuleForm;