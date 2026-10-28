import type { CSSProperties } from 'react'
import { TimelessNames } from './TimelessRules'
import type { Celebration } from '../../invitations/model'
import { useDesign14Carousel } from './useDesign14Carousel'

// Existing invitation artwork and geometry, preserved as JSX.
type Names = { groom: string; bride: string }
type PersonalDetails = Names & { groomFamily?: string; brideFamily?: string; message?: string; date?: string; opened?: boolean }
function eventDateParts(value: string) {
  const date = new Date(`${value}T12:00:00Z`)
  return { month: date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' }), day: String(date.getUTCDate()), iso: value }
}
function eventTime(value: string) {
  return new Date(`2000-01-01T${value}:00Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
}

export function OpeningScene({ groom, bride, date, opened = false }: PersonalDetails) {
  const weddingDate = date ? new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '3rd February 2027'
  return (
    <div className={"d14-wnkptn"} data-d14-name={"PAGE 1"}>
      <div className={"d14-151n5zr"} data-d14-name={"SKY"}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} width={"4092"} height={"6148"} sizes={"(min-width: 1440px) max(calc(100vw + 686px), 100vw), (min-width: 1201px) and (max-width: 1439.98px) max(calc(100vw + 686px), 100vw), (min-width: 810px) and (max-width: 1200.98px) max(calc(100vw + 686px), 100vw), (max-width: 809.98px) max(calc(100vw + 686px), 100vw)"} srcSet={"/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 681w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 1363w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 2726w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 4092w"} src={"/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
        <div className={"d14-1edylky"} data-d14-name={"cloud2"} style={{"willChange": "transform", "opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
          <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
            <img decoding={"async"} width={"1536"} height={"1024"} sizes={"(min-width: 1440px) calc((100vw + 686px) * 0.4072), (min-width: 1201px) and (max-width: 1439.98px) calc((100vw + 686px) * 0.4072), (min-width: 810px) and (max-width: 1200.98px) calc((100vw + 686px) * 0.4072), (max-width: 809.98px) calc((100vw + 686px) * 0.4072)"} srcSet={"/templates/a-timeless-union/assets/0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp 512w,/templates/a-timeless-union/assets/0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp 1024w,/templates/a-timeless-union/assets/0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp 1536w"} src={"/templates/a-timeless-union/assets/0IJJIgu6Wx8qN5wGM26QzcUWTNg.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
          </div>
        </div>
        <div className={"d14-1l515fq"} data-d14-name={"cloud"} style={{"willChange": "transform", "opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
          <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
            <img decoding={"async"} width={"1536"} height={"1024"} sizes={"(min-width: 1440px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (min-width: 1201px) and (max-width: 1439.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (min-width: 810px) and (max-width: 1200.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (max-width: 809.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165))"} srcSet={"/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 512w,/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 1024w,/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 1536w"} src={"/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
          </div>
        </div>
        <div className={"d14-lm7ks0"} data-d14-name={"cloud"} style={{"willChange": "transform", "opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
          <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
            <img decoding={"async"} width={"1536"} height={"1024"} sizes={"(min-width: 1440px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (min-width: 1201px) and (max-width: 1439.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (min-width: 810px) and (max-width: 1200.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165)), (max-width: 809.98px) max(calc((100vw + 686px) * 0.1538), calc((100vw + 686px) * 0.3165))"} srcSet={"/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 512w,/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 1024w,/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp 1536w"} src={"/templates/a-timeless-union/assets/zGWp5UP4NXxBVD059Ha4jDG8lIE.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
          </div>
        </div>
        <div className="d14-rules-opening d14-entry-name" aria-hidden={!opened} style={{opacity:0,visibility:opened?'visible':'hidden'}}>
          <TimelessNames groom={groom} bride={bride} stacked separator="WEDS" />
          <p className="d14-rules-opening-date">{weddingDate}</p>
        </div>
        <img className={"d14-local-cloud"} src={"/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp"} alt={""} aria-hidden={"true"} />
      </div>
      <div className={"d14-29qdai"} data-d14-appear-id={"29qdai"} data-d14-name={"TEMPLE"} style={{"willChange": "transform", "opacity": "0.001", "transform": "none"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} width={"1872"} height={"2607"} sizes={"(min-width: 1440px) 100vw, (min-width: 1201px) and (max-width: 1439.98px) 100vw, (min-width: 810px) and (max-width: 1200.98px) 100vw, (max-width: 809.98px) 100vw"} srcSet={"/templates/a-timeless-union/assets/nMi6QUEDQLWoopKcsbxHe7tv3w.webp 735w,/templates/a-timeless-union/assets/nMi6QUEDQLWoopKcsbxHe7tv3w.webp 1470w,/templates/a-timeless-union/assets/nMi6QUEDQLWoopKcsbxHe7tv3w.webp 1872w"} src={"/templates/a-timeless-union/assets/nMi6QUEDQLWoopKcsbxHe7tv3w.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-g6t4xr"} data-d14-appear-id={"g6t4xr"} data-d14-name={"GATE 1"} style={{"opacity": "0.001", "transform": "none"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} width={"3072"} height={"5504"} sizes={"(min-width: 1440px) 100vw, (min-width: 1201px) and (max-width: 1439.98px) 100vw, (min-width: 810px) and (max-width: 1200.98px) 100vw, (max-width: 809.98px) 100vw"} srcSet={"/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp 571w,/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp 1143w,/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp 2286w,/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp 3072w"} src={"/templates/a-timeless-union/assets/ELOlTg3x5fKABGtAydCmkvEWw.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
    </div>
  )
}

export function WelcomeScene({ groom, bride, groomFamily, brideFamily, message }: PersonalDetails) {
  return (
    <div className={"d14-15337ob"} data-d14-name={"PAGE 2"}>
      <div className={"d14-e0yggs"} data-d14-name={"SKY"}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} width={"4092"} height={"6148"} sizes={"(min-width: 1440px) max(calc(100vw + 686px), 100vw), (min-width: 1201px) and (max-width: 1439.98px) max(calc(100vw + 686px), 100vw), (min-width: 810px) and (max-width: 1200.98px) max(calc(100vw + 686px), 100vw), (max-width: 809.98px) max(calc(100vw + 686px), 100vw)"} srcSet={"/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 681w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 1363w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 2726w,/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp 4092w"} src={"/templates/a-timeless-union/assets/1Zg49ggjH1NeMsuurkKzD6m20vo.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-zsvt63"} data-d14-name={"GATE 2"}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"1840"} height={"3392"} sizes={"(min-width: 1440px) calc(100vw + 30px), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw + 30px), (min-width: 810px) and (max-width: 1200.98px) calc(100vw + 30px), (max-width: 809.98px) calc(100vw + 30px)"} srcSet={"/templates/a-timeless-union/assets/B5f8HoBhbFrJjeGqkq0pmPmd2BE.webp 555w,/templates/a-timeless-union/assets/B5f8HoBhbFrJjeGqkq0pmPmd2BE.webp 1110w,/templates/a-timeless-union/assets/B5f8HoBhbFrJjeGqkq0pmPmd2BE.webp 1840w"} src={"/templates/a-timeless-union/assets/B5f8HoBhbFrJjeGqkq0pmPmd2BE.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "contain"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-page-two-content"}>
        <img className={"d14-page-two-ganesh"} src={"/templates/a-timeless-union/assets/7Jc7F5U6LjAzdX4ypVkjja74nO8.webp"} width={"2500"} height={"2500"} alt={"Lord Ganesha"} loading={"lazy"} decoding={"async"} />
        <p className={"d14-page-two-invocation"} lang={"sa"}>
          {"॥ ॐ श्री गणेशाय नमः ॥"}
        </p>
        <p className={"d14-page-two-intro"} hidden={message !== undefined && !message.trim()}>
          {message === undefined ? <>{'With the blessings of God and our beloved families,'}<br />{'we joyfully invite you to celebrate the wedding of'}</> : message}
        </p>
        <TimelessNames groom={groom} bride={bride} groomFamily={groomFamily === undefined ? 'Son of Sri Bhaskar Shetty P & Smt. Shilpashri B. Shetty,\nGrandson of Late Puttanna Shetty Pandubettu and Late Bhoja S. Shetty Shanarabettu.\nBrother of Dr. Anmol B. Shetty.' : groomFamily} brideFamily={brideFamily === undefined ? 'Daughter of Sri Sadashiva Shetty & Smt. Rekha S. Shetty.\nGranddaughter of Haradi Marbinamane Late Krishnayya Shetty, Chantharu Guddemane Late Hiriyanna Shetty.\nSister of Suhas Shetty & Chinraj Shetty.' : brideFamily} />
        <div className={"d14-page-two-celebrate"}>
          <span className={"d14-page-two-divider"} aria-hidden={"true"}>
            <i />
          </span>
          <p>
            {"Join us to celebrate"}
          </p>
          <span className={"d14-page-two-divider"} aria-hidden={"true"}>
            <i />
          </span>
        </div>
      </div>
    </div>
  )
}

export function CoupleScene() {
  return (
    <div className={"d14-1oftkfg"} data-d14-name={"PAGE 3"}>
      <div className={"d14-achuyf"} data-d14-name={"RIVER"} style={{"transform": "translate(-50%, -50%) rotate(2deg)"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"4092"} height={"6148"} sizes={"(min-width: 1440px) calc(100vw * 1.0767), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw * 1.0767), (min-width: 810px) and (max-width: 1200.98px) calc(100vw * 1.0767), (max-width: 809.98px) calc(100vw * 1.0767)"} srcSet={"/templates/a-timeless-union/assets/7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp 681w,/templates/a-timeless-union/assets/7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp 1363w,/templates/a-timeless-union/assets/7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp 2726w,/templates/a-timeless-union/assets/7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp 4092w"} src={"/templates/a-timeless-union/assets/7zuZ0FhlmRAIbtHSZLZ5aiTTWg.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-184cs0n"} data-d14-name={"CLOUD"} style={{"opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"2884"} height={"1739"} sizes={"(min-width: 1440px) calc(100vw * 0.5142), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw * 0.5142), (min-width: 810px) and (max-width: 1200.98px) calc(100vw * 0.5142), (max-width: 809.98px) calc(100vw * 0.5142)"} srcSet={"/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp 512w,/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp 1024w,/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp 2048w,/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp 2884w"} src={"/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-1vigtqz"} data-d14-name={"CLOUD 2"} style={{"opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"3458"} height={"1697"} sizes={"(min-width: 1440px) calc(100vw * 0.5558), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw * 0.5558), (min-width: 810px) and (max-width: 1200.98px) calc(100vw * 0.5558), (max-width: 809.98px) calc(100vw * 0.5558)"} srcSet={"/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 512w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 1024w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 2048w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 3458w"} src={"/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-174rvji"} data-d14-name={"CLOUD 3"} style={{"opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"3458"} height={"1697"} sizes={"(min-width: 1440px) calc(100vw * 0.5558), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw * 0.5558), (min-width: 810px) and (max-width: 1200.98px) calc(100vw * 0.5558), (max-width: 809.98px) calc(100vw * 0.5558)"} srcSet={"/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 512w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 1024w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 2048w,/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp 3458w"} src={"/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-lai5pb"} data-d14-name={"TEMPLE"}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"4092"} height={"6148"} sizes={"(min-width: 1440px) calc(100vw + 15px), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw + 15px), (min-width: 810px) and (max-width: 1200.98px) calc(100vw + 15px), (max-width: 809.98px) calc(100vw + 15px)"} srcSet={"/templates/a-timeless-union/assets/m6r8eopxGbzyLR1bYUq6zvkRnw.webp 681w,/templates/a-timeless-union/assets/m6r8eopxGbzyLR1bYUq6zvkRnw.webp 1363w,/templates/a-timeless-union/assets/m6r8eopxGbzyLR1bYUq6zvkRnw.webp 2726w,/templates/a-timeless-union/assets/m6r8eopxGbzyLR1bYUq6zvkRnw.webp 4092w"} src={"/templates/a-timeless-union/assets/m6r8eopxGbzyLR1bYUq6zvkRnw.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
        </div>
      </div>
      <div className={"d14-o2esm3"} data-d14-name={"GATE 2"}>
        <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
          <img decoding={"async"} loading={"lazy"} width={"3452"} height={"6385"} sizes={"(min-width: 1440px) calc(100vw + 30px), (min-width: 1201px) and (max-width: 1439.98px) calc(100vw + 30px), (min-width: 810px) and (max-width: 1200.98px) calc(100vw + 30px), (max-width: 809.98px) calc(100vw + 30px)"} srcSet={"/templates/a-timeless-union/assets/PWKoRE4Df4zZJLisykUKiwZnlRE.webp 553w,/templates/a-timeless-union/assets/PWKoRE4Df4zZJLisykUKiwZnlRE.webp 1107w,/templates/a-timeless-union/assets/PWKoRE4Df4zZJLisykUKiwZnlRE.webp 2214w,/templates/a-timeless-union/assets/PWKoRE4Df4zZJLisykUKiwZnlRE.webp 3452w"} src={"/templates/a-timeless-union/assets/PWKoRE4Df4zZJLisykUKiwZnlRE.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "contain"} as CSSProperties} />
        </div>
      </div>
      <svg className={"d14-dpjwwo"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 132 139"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
        <foreignObject width={"100%"} height={"100%"} className={"d14-fit-text"} transform={"scale(1)"} style={{"overflow": "visible", "transformOrigin": "center center"} as CSSProperties}>
          <p dir={"auto"} style={{"--font-selector": "R0Y7UGxheWZhaXIgRGlzcGxheS03MDA=", "--d14-font-family": "\"Playfair Display\", \"Playfair Display Placeholder\", serif", "--d14-font-size": "58px", "--d14-font-weight": "700", "--d14-text-alignment": "center", "--d14-text-color": "rgb(120, 104, 85)"} as CSSProperties} className={"d14-text"}>
            {"Meet"}
          </p>
          <p dir={"auto"} style={{"--font-selector": "R0Y7UGxheWZhaXIgRGlzcGxheS03MDA=", "--d14-font-family": "\"Playfair Display\", \"Playfair Display Placeholder\", serif", "--d14-font-size": "58px", "--d14-font-weight": "700", "--d14-text-alignment": "center", "--d14-text-color": "rgb(120, 104, 85)"} as CSSProperties} className={"d14-text"}>
            {"The"}
          </p>
        </foreignObject>
      </svg>
      <svg className={"d14-19f2x77"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 266 148"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
        <foreignObject width={"100%"} height={"100%"} className={"d14-fit-text"} transform={"scale(1)"} style={{"overflow": "visible", "transformOrigin": "center center"} as CSSProperties}>
          <p dir={"auto"} style={{"--font-selector": "R0Y7QWxleCBCcnVzaC1yZWd1bGFy", "--d14-font-family": "\"Alex Brush\", sans-serif", "--d14-font-size": "123px", "--d14-text-alignment": "center", "--d14-text-color": "rgb(242, 113, 127)"} as CSSProperties} className={"d14-text"}>
            {"Bride"}
          </p>
        </foreignObject>
      </svg>
      <svg className={"d14-132po0z"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 297 148"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
        <foreignObject width={"100%"} height={"100%"} className={"d14-fit-text"} transform={"scale(1)"} style={{"overflow": "visible", "transformOrigin": "center center"} as CSSProperties}>
          <p dir={"auto"} style={{"--font-selector": "R0Y7QWxleCBCcnVzaC1yZWd1bGFy", "--d14-font-family": "\"Alex Brush\", sans-serif", "--d14-font-size": "123px", "--d14-text-alignment": "center", "--d14-text-color": "rgb(0, 112, 161)"} as CSSProperties} className={"d14-text"}>
            {"Groom"}
          </p>
        </foreignObject>
      </svg>
      <svg className={"d14-11fqeu6"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 93 148"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
        <foreignObject width={"100%"} height={"100%"} className={"d14-fit-text"} transform={"scale(1)"} style={{"overflow": "visible", "transformOrigin": "center center"} as CSSProperties}>
          <p dir={"auto"} style={{"--font-selector": "R0Y7QWxleCBCcnVzaC1yZWd1bGFy", "--d14-font-family": "\"Alex Brush\", sans-serif", "--d14-font-size": "123px", "--d14-text-alignment": "center", "--d14-text-color": "rgb(238, 205, 151)"} as CSSProperties} className={"d14-text"}>
            {"&"}
          </p>
        </foreignObject>
      </svg>
      <div className={"ssr-variant"}>
        <div className={"d14-couple-window"}>
          <div className={"d14-1iuxrf7"} data-d14-name={"COUPLE"} style={{"willChange": "transform", "opacity": "1", "transform": "translate(-50%, -50%)"} as CSSProperties}>
            <div style={{"position": "absolute", "borderRadius": "inherit", "cornerShape": "inherit", "top": "0", "right": "0", "bottom": "0", "left": "0"} as CSSProperties} data-d14-background-image-wrapper={"true"}>
              <img decoding={"async"} loading={"lazy"} width={"4092"} height={"6148"} sizes={"(min-width: 1440px) 705.9441px, (min-width: 1201px) and (max-width: 1439.98px) 705.9441px, (min-width: 810px) and (max-width: 1200.98px) 705.9441px, (max-width: 809.98px) 947.1956px"} srcSet={"/templates/a-timeless-union/assets/vQg4boZ9HQXfZOfpCDWS9lFQE.webp 681w,/templates/a-timeless-union/assets/vQg4boZ9HQXfZOfpCDWS9lFQE.webp 1363w,/templates/a-timeless-union/assets/vQg4boZ9HQXfZOfpCDWS9lFQE.webp 2726w,/templates/a-timeless-union/assets/vQg4boZ9HQXfZOfpCDWS9lFQE.webp 4092w"} src={"/templates/a-timeless-union/assets/vQg4boZ9HQXfZOfpCDWS9lFQE.webp"} alt="" style={{"display": "block", "width": "100%", "height": "100%", "borderRadius": "inherit", "cornerShape": "inherit", "objectPosition": "center", "objectFit": "cover"} as CSSProperties} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EngagementCard({ duplicate = false, event }: { duplicate?: boolean; event: Celebration }) {
  const date = eventDateParts(event.date)
  return (
    <section data-carousel-clone={duplicate ? "" : undefined} aria-hidden={duplicate || undefined} inert={duplicate} className={"d14-engagement-section"} data-d14-name={"Engagement Ceremony"} id={"d14-engagement-slide" + (duplicate ? "-loop" : "")} aria-labelledby={"d14-engagement-title" + (duplicate ? "-loop" : "")} aria-roledescription={"slide"}>
      <img className={"d14-engagement-art"} src={"/templates/a-timeless-union/assets/engagement.webp"} width={"962"} height={"1634"} alt={""} loading={"lazy"} decoding={"async"} />
      <article className={"d14-engagement-content"}>
        <h2 className={"d14-engagement-heading"} id={"d14-engagement-title" + (duplicate ? "-loop" : "")}>
          <span className={"d14-engagement-sr-only"}>
            {"Engagement "}
          </span>
          {event.title}
        </h2>
        <time className={"d14-engagement-date"} dateTime={`${date.iso}T${event.time}`}>
          <span className={"d14-event-month"}>
            {date.month}
          </span>
          <span className={"d14-engagement-date-row"}>
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <span className={"d14-engagement-day"}>
              {date.day}
            </span>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
          </span>
        </time>
        <p className={"d14-engagement-time"}>
          {eventTime(event.time)}
        </p>
        <div className={"d14-engagement-rule"} aria-hidden={"true"}>
          <svg className={"d14-engagement-lotus"} viewBox={"0 0 60 44"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.5"} aria-hidden={"true"}>
            <path d={"M30 3C20 14 20 25 30 35C40 25 40 14 30 3ZM30 35C12 34 7 24 6 14C19 15 27 23 30 35ZM30 35C48 34 53 24 54 14C41 15 33 23 30 35ZM30 35C15 43 5 34 2 27C14 25 23 29 30 35ZM30 35C45 43 55 34 58 27C46 25 37 29 30 35Z"} />
            <path d={"M20 40h20"} />
          </svg>
        </div>
        <div className={"d14-engagement-venue"}>
          <p className={"d14-engagement-venue-name"}>
            {event.venue}
          </p>
          <p className={"d14-engagement-venue-city"}>
            {event.address}
          </p>
        </div>
        <svg className={"d14-engagement-footer-ornament"} viewBox={"0 0 180 50"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.4"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={"M90 4C77 16 79 26 90 32C101 26 103 16 90 4ZM90 32C69 31 64 22 63 14C77 16 84 22 90 32ZM90 32C111 31 116 22 117 14C103 16 96 22 90 32ZM88 37C64 48 47 19 26 23C12 26 17 38 24 33M92 37C116 48 133 19 154 23C168 26 163 38 156 33M65 35C49 34 51 9 38 13C29 17 37 24 42 18M115 35C131 34 129 9 142 13C151 17 143 24 138 18M90 37v9"} />
          <path d={"m90 41 3 4-3 4-3-4Z"} fill={"currentColor"} />
        </svg>
      </article>
    </section>
  )
}

function SangeethCard({ duplicate = false, event }: { duplicate?: boolean; event: Celebration }) {
  const date = eventDateParts(event.date)
  return (
    <section data-carousel-clone={duplicate ? "" : undefined} aria-hidden={duplicate || undefined} inert={duplicate} className={"d14-engagement-section d14-sangeet-section"} data-d14-name={"Sangeeth Celebration"} id={"d14-sangeet-slide" + (duplicate ? "-loop" : "")} aria-labelledby={"d14-sangeet-title" + (duplicate ? "-loop" : "")} aria-roledescription={"slide"}>
      <img className={"d14-engagement-art"} src={"/templates/a-timeless-union/assets/sangeet.webp"} width={"962"} height={"1635"} alt={""} loading={"lazy"} decoding={"async"} />
      <article className={"d14-engagement-content"}>
        <h2 className={"d14-engagement-heading"} id={"d14-sangeet-title" + (duplicate ? "-loop" : "")}>
          <span className={"d14-engagement-sr-only"}>
            {"Sangeeth "}
          </span>
          {event.title}
        </h2>
        <time className={"d14-engagement-date"} dateTime={`${date.iso}T${event.time}`}>
          <span className={"d14-event-month"}>
            {date.month}
          </span>
          <span className={"d14-engagement-date-row"}>
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <span className={"d14-engagement-day"}>
              {date.day}
            </span>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
          </span>
        </time>
        <p className={"d14-engagement-time"}>
          {eventTime(event.time)}
        </p>
        <div className={"d14-engagement-rule"} aria-hidden={"true"}>
          <svg className={"d14-engagement-lotus"} viewBox={"0 0 60 44"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.5"} aria-hidden={"true"}>
            <path d={"M30 3C20 14 20 25 30 35C40 25 40 14 30 3ZM30 35C12 34 7 24 6 14C19 15 27 23 30 35ZM30 35C48 34 53 24 54 14C41 15 33 23 30 35ZM30 35C15 43 5 34 2 27C14 25 23 29 30 35ZM30 35C45 43 55 34 58 27C46 25 37 29 30 35Z"} />
            <path d={"M20 40h20"} />
          </svg>
        </div>
        <div className={"d14-engagement-venue"}>
          <p className={"d14-engagement-venue-name"}>
            {event.venue}
          </p>
          <p className={"d14-engagement-venue-city"}>
            {event.address}
          </p>
        </div>
        <svg className={"d14-engagement-footer-ornament"} viewBox={"0 0 180 50"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.4"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={"M90 4C77 16 79 26 90 32C101 26 103 16 90 4ZM90 32C69 31 64 22 63 14C77 16 84 22 90 32ZM90 32C111 31 116 22 117 14C103 16 96 22 90 32ZM88 37C64 48 47 19 26 23C12 26 17 38 24 33M92 37C116 48 133 19 154 23C168 26 163 38 156 33M65 35C49 34 51 9 38 13C29 17 37 24 42 18M115 35C131 34 129 9 142 13C151 17 143 24 138 18M90 37v9"} />
          <path d={"m90 41 3 4-3 4-3-4Z"} fill={"currentColor"} />
        </svg>
      </article>
    </section>
  )
}

function MarriageCard({ duplicate = false, event }: { duplicate?: boolean; event: Celebration }) {
  const date = eventDateParts(event.date)
  return (
    <section data-carousel-clone={duplicate ? "" : undefined} aria-hidden={duplicate || undefined} inert={duplicate} className={"d14-engagement-section d14-wedding-section"} data-d14-name={"Marriage Ceremony"} id={"d14-wedding-slide" + (duplicate ? "-loop" : "")} aria-labelledby={"d14-wedding-title" + (duplicate ? "-loop" : "")} aria-roledescription={"slide"}>
      <img className={"d14-engagement-art"} src={"/templates/a-timeless-union/assets/wedding.webp"} width={"962"} height={"1635"} alt={""} loading={"lazy"} decoding={"async"} />
      <article className={"d14-engagement-content"}>
        <h2 className={"d14-engagement-heading"} id={"d14-wedding-title" + (duplicate ? "-loop" : "")}>
          <span className={"d14-engagement-sr-only"}>
            {"Marriage "}
          </span>
          {event.title}
        </h2>
        <time className={"d14-engagement-date"} dateTime={`${date.iso}T${event.time}`}>
          <span className={"d14-event-month"}>
            {date.month}
          </span>
          <span className={"d14-engagement-date-row"}>
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <span className={"d14-engagement-day"}>
              {date.day}
            </span>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
          </span>
        </time>
        <p className={"d14-engagement-time"}>
          {eventTime(event.time)}
        </p>
        <div className={"d14-engagement-rule"} aria-hidden={"true"}>
          <svg className={"d14-engagement-lotus"} viewBox={"0 0 60 44"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.5"} aria-hidden={"true"}>
            <path d={"M30 3C20 14 20 25 30 35C40 25 40 14 30 3ZM30 35C12 34 7 24 6 14C19 15 27 23 30 35ZM30 35C48 34 53 24 54 14C41 15 33 23 30 35ZM30 35C15 43 5 34 2 27C14 25 23 29 30 35ZM30 35C45 43 55 34 58 27C46 25 37 29 30 35Z"} />
            <path d={"M20 40h20"} />
          </svg>
        </div>
        <div className={"d14-engagement-venue"}>
          <p className={"d14-engagement-venue-name"}>
            {event.venue}
          </p>
          <p className={"d14-engagement-venue-city"}>
            {event.address}
          </p>
        </div>
        <svg className={"d14-engagement-footer-ornament"} viewBox={"0 0 180 50"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.4"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={"M90 4C77 16 79 26 90 32C101 26 103 16 90 4ZM90 32C69 31 64 22 63 14C77 16 84 22 90 32ZM90 32C111 31 116 22 117 14C103 16 96 22 90 32ZM88 37C64 48 47 19 26 23C12 26 17 38 24 33M92 37C116 48 133 19 154 23C168 26 163 38 156 33M65 35C49 34 51 9 38 13C29 17 37 24 42 18M115 35C131 34 129 9 142 13C151 17 143 24 138 18M90 37v9"} />
          <path d={"m90 41 3 4-3 4-3-4Z"} fill={"currentColor"} />
        </svg>
      </article>
    </section>
  )
}

function ReceptionCard({ duplicate = false, event }: { duplicate?: boolean; event: Celebration }) {
  const date = eventDateParts(event.date)
  return (
    <section data-carousel-clone={duplicate ? "" : undefined} aria-hidden={duplicate || undefined} inert={duplicate} className={"d14-engagement-section d14-reception-section"} data-d14-name={"Reception Celebration"} id={"d14-reception-slide" + (duplicate ? "-loop" : "")} aria-labelledby={"d14-reception-title" + (duplicate ? "-loop" : "")} aria-roledescription={"slide"}>
      <img className={"d14-engagement-art"} src={"/templates/a-timeless-union/assets/reception.webp"} width={"962"} height={"1635"} alt={""} loading={"lazy"} decoding={"async"} />
      <article className={"d14-engagement-content"}>
        <h2 className={"d14-engagement-heading"} id={"d14-reception-title" + (duplicate ? "-loop" : "")}>
          <span className={"d14-engagement-sr-only"}>
            {"Reception "}
          </span>
          {event.title}
        </h2>
        <time className={"d14-engagement-date"} dateTime={`${date.iso}T${event.time}`}>
          <span className={"d14-event-month"}>
            {date.month}
          </span>
          <span className={"d14-engagement-date-row"}>
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <span className={"d14-engagement-day"}>
              {date.day}
            </span>
            <span className={"d14-event-date-line"} aria-hidden={"true"} />
            <svg className={"d14-engagement-floret"} viewBox={"0 0 30 54"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.2"} aria-hidden={"true"}>
              <path d={"M15 2C5 15 5 20 15 27C25 20 25 15 15 2ZM15 52C5 39 5 34 15 27C25 34 25 39 15 52ZM15 27C3 14-4 24 15 27C3 40-4 30 15 27ZM15 27C27 14 34 24 15 27C27 40 34 30 15 27Z"} />
              <circle cx={"15"} cy={"27"} r={"3"} fill={"#9D3041"} />
            </svg>
          </span>
        </time>
        <p className={"d14-engagement-time"}>
          {eventTime(event.time)}
        </p>
        <div className={"d14-engagement-rule"} aria-hidden={"true"}>
          <svg className={"d14-engagement-lotus"} viewBox={"0 0 60 44"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.5"} aria-hidden={"true"}>
            <path d={"M30 3C20 14 20 25 30 35C40 25 40 14 30 3ZM30 35C12 34 7 24 6 14C19 15 27 23 30 35ZM30 35C48 34 53 24 54 14C41 15 33 23 30 35ZM30 35C15 43 5 34 2 27C14 25 23 29 30 35ZM30 35C45 43 55 34 58 27C46 25 37 29 30 35Z"} />
            <path d={"M20 40h20"} />
          </svg>
        </div>
        <div className={"d14-engagement-venue"}>
          <p className={"d14-engagement-venue-name"}>
            {event.venue}
          </p>
          <p className={"d14-engagement-venue-city"}>
            {event.address}
          </p>
        </div>
        <svg className={"d14-engagement-footer-ornament"} viewBox={"0 0 180 50"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.4"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={"M90 4C77 16 79 26 90 32C101 26 103 16 90 4ZM90 32C69 31 64 22 63 14C77 16 84 22 90 32ZM90 32C111 31 116 22 117 14C103 16 96 22 90 32ZM88 37C64 48 47 19 26 23C12 26 17 38 24 33M92 37C116 48 133 19 154 23C168 26 163 38 156 33M65 35C49 34 51 9 38 13C29 17 37 24 42 18M115 35C131 34 129 9 142 13C151 17 143 24 138 18M90 37v9"} />
          <path d={"m90 41 3 4-3 4-3-4Z"} fill={"currentColor"} />
        </svg>
      </article>
    </section>
  )
}

export function Celebrations({ opened, events }: { opened: boolean; events: [Celebration, Celebration, Celebration, Celebration] }) {
  const { galleryRef, selected, goTo } = useDesign14Carousel(opened)
  return (
    <div className={"d14-event-gallery"} role={"region"} aria-label={"Wedding celebrations"} aria-roledescription={"carousel"} ref={galleryRef}>
      <div className={"d14-event-gallery-nav"} style={{ "--d14-selected-event": selected } as CSSProperties} role={"group"} aria-label={"Choose an event"}>
        <span className="d14-event-gallery-indicator" aria-hidden="true" />
        <button type={"button"} data-event-index={"0"} aria-controls={"d14-engagement-slide"} aria-pressed={selected === 0} onClick={() => goTo(0)}>
          <span className="d14-event-label">Engagement</span>
        </button>
        <button type={"button"} data-event-index={"1"} aria-controls={"d14-sangeet-slide"} aria-pressed={selected === 1} onClick={() => goTo(1)}>
          <span className="d14-event-label">Sangeeth</span>
        </button>
        <button type={"button"} data-event-index={"2"} aria-controls={"d14-wedding-slide"} aria-pressed={selected === 2} onClick={() => goTo(2)}>
          <span className="d14-event-label">Marriage</span>
        </button>
        <button type={"button"} data-event-index={"3"} aria-controls={"d14-reception-slide"} aria-pressed={selected === 3} onClick={() => goTo(3)}>
          <span className="d14-event-label">Reception</span>
        </button>
      </div>
      <div className={"d14-event-gallery-track"} tabIndex={0} aria-label={"Event invitations. Swipe horizontally or use the left and right arrow keys."}>
        <ReceptionCard duplicate event={events[3]} />
        <EngagementCard event={events[0]} />
        <SangeethCard event={events[1]} />
        <MarriageCard event={events[2]} />
        <ReceptionCard event={events[3]} />
        <EngagementCard duplicate event={events[0]} />
      </div>
    </div>
  )
}

export function ClosingScene({ showIllustrations = true }: { showIllustrations?: boolean }) {
  return (
    <section className={"d14-end-scene"} data-d14-name={"End Scene"} aria-label={"Temple scene"}>
      <div className={"d14-end-clouds"} aria-hidden={"true"}>
        <img className={"d14-end-cloud d14-end-cloud--high"} src={"/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp"} alt={""} loading={"lazy"} decoding={"async"} />
        <img className={"d14-end-cloud d14-end-cloud--middle"} src={"/templates/a-timeless-union/assets/CZscgvlYOVQHkdN9UbKXk28.webp"} alt={""} loading={"lazy"} decoding={"async"} />
        <img className={"d14-end-cloud d14-end-cloud--low"} src={"/templates/a-timeless-union/assets/UeasMBu07jHUk5ch5onj5OD9f4.webp"} alt={""} loading={"lazy"} decoding={"async"} />
      </div>
      <img className={"d14-end-scene-art"} src={"/templates/a-timeless-union/assets/end-scene.webp"} width={"1024"} height={"1536"} alt={"An ornate temple decorated with flowers and saffron flags"} loading={"lazy"} decoding={"async"} />
      <img hidden={!showIllustrations} data-couple-illustration="" className="d14-end-couple" src="/templates/a-timeless-union/assets/brideandgrrom.webp" width="1024" height="1536" alt="Bride and groom exchanging wedding garlands" loading="lazy" decoding="async" />
      <div className={"d14-end-gratitude"}>
        <p className={"d14-end-gratitude-intro"}>
          {"With hearts full of gratitude"}
        </p>
        <h2 className={"d14-end-gratitude-title"}>
          {"Your"}
          <br />
          {"Presence"}
        </h2>
        <p className={"d14-end-gratitude-blessing"}>
          {"is our greatest blessing"}
        </p>
      </div>
    </section>
  )
}

export function InvitationContact() {
  return (
    <footer className="d14-invitation-contact" aria-label="Invitation enquiries">
      <p>For invitations, contact</p>
      <a href={`https://wa.me/917975948093?text=${encodeURIComponent('Hey I need an invitation!')}`} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp for an invitation">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M20.52 3.48A11.85 11.85 0 0 0 12.04 0C5.47 0 .13 5.34.12 11.9c0 2.1.55 4.16 1.59 5.98L.02 24l6.26-1.64a11.94 11.94 0 0 0 5.75 1.46h.01c6.56 0 11.91-5.34 11.91-11.9 0-3.18-1.24-6.17-3.43-8.44ZM12.04 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.22-3.72.98.99-3.63-.24-.37a9.86 9.86 0 0 1-1.52-5.28c0-5.45 4.44-9.88 9.9-9.88a9.8 9.8 0 0 1 7.01 2.91 9.82 9.82 0 0 1 2.89 7.02c0 5.44-4.44 9.85-9.91 9.85Zm5.43-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.88 1.21 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </footer>
  )
}

export function SvgDefinitions() {
  return (
    <div id={"svg-templates"} style={{"position": "absolute", "overflow": "hidden", "bottom": "0", "left": "0", "width": "0", "height": "0", "zIndex": "0", "contain": "strict"} as CSSProperties} aria-hidden={"true"}>
      <svg id={"4282185190"} display={"block"} role={"presentation"} viewBox={"0 0 24 24"} xmlns={"http://www.w3.org/2000/svg"}>
        <path d={"M 9.75 16.5 C 9.75 16.5 0 11.25 0 5.063 C 0 2.267 2.267 0 5.063 0 C 7.18 0 8.994 1.154 9.75 3 C 10.506 1.154 12.32 0 14.438 0 C 17.233 0 19.5 2.267 19.5 5.063 C 19.5 11.25 9.75 16.5 9.75 16.5 Z"} fillOpacity={"var(--1m6trwb, 0)"} fill={"var(--21h8s6, rgb(0, 0, 0))"} height={"16.5px"} id={"wiQQwX4vy"} transform={"translate(2.25 4.5)"} width={"19.5px"} />
        <path d={"M 9.75 16.5 C 9.75 16.5 0 11.25 0 5.063 C 0 2.267 2.267 0 5.063 0 C 7.18 0 8.994 1.154 9.75 3 C 10.506 1.154 12.32 0 14.438 0 C 17.233 0 19.5 2.267 19.5 5.063 C 19.5 11.25 9.75 16.5 9.75 16.5 Z"} fill={"transparent"} height={"16.5px"} id={"vRuguQC0z"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(2.25 4.5)"} width={"19.5px"} />
      </svg>
      <svg id={"4244954862"} display={"block"} role={"presentation"} viewBox={"0 0 24 24"} xmlns={"http://www.w3.org/2000/svg"}>
        <path d={"M 4.493 16.79 C 8.403 19.053 13.386 18.066 16.138 14.483 C 18.891 10.9 18.56 5.831 15.365 2.636 C 12.17 -0.559 7.101 -0.89 3.518 1.863 C -0.065 4.615 -1.052 9.598 1.211 13.508 L 1.211 13.508 L 0.039 17.01 C -0.051 17.279 0.019 17.577 0.22 17.777 C 0.421 17.978 0.718 18.049 0.987 17.959 Z"} fillOpacity={"var(--1m6trwb, 0)"} fill={"var(--21h8s6, rgb(0, 0, 0))"} height={"18.00072584206196px"} id={"oYFcf38la"} transform={"translate(3.001 3.002)"} width={"18.000910893351044px"} />
        <path d={"M 4.493 16.79 C 8.403 19.053 13.386 18.066 16.138 14.483 C 18.891 10.9 18.56 5.831 15.365 2.636 C 12.17 -0.559 7.101 -0.89 3.518 1.863 C -0.065 4.615 -1.052 9.598 1.211 13.508 L 1.211 13.508 L 0.039 17.01 C -0.051 17.279 0.019 17.577 0.22 17.777 C 0.421 17.978 0.718 18.049 0.987 17.959 Z"} fill={"transparent"} height={"18.00072584206196px"} id={"pQKY8C1Uw"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(3.001 3.002)"} width={"18.000910893351044px"} />
        <path d={"M 0 0 L 6 0"} fill={"transparent"} height={"1px"} id={"wlcaZryVX"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(9 10.5)"} width={"6px"} />
        <path d={"M 0 0 L 6 0"} fill={"transparent"} height={"1px"} id={"Wbp0kUWPc"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(9 13.5)"} width={"6px"} />
      </svg>
      <svg id={"777087443"} display={"block"} role={"presentation"} viewBox={"0 0 24 24"} xmlns={"http://www.w3.org/2000/svg"}>
        <path d={"M 19.472 0.953 C 19.545 0.692 19.472 0.412 19.28 0.22 C 19.088 0.028 18.808 -0.045 18.546 0.028 L 0.546 5.486 C 0.245 5.571 0.029 5.834 0.003 6.145 C -0.023 6.457 0.147 6.752 0.429 6.886 L 8.626 10.874 L 12.614 19.07 C 12.748 19.352 13.043 19.522 13.354 19.496 C 13.666 19.47 13.929 19.253 14.013 18.953 Z"} fillOpacity={"var(--1m6trwb, 0)"} fill={"var(--21h8s6, rgb(0, 0, 0))"} height={"19.498812438350562px"} id={"VRZKpSmTT"} transform={"translate(1.499 3.001)"} width={"19.49974993835056px"} />
        <path d={"M 0 4.875 L 4.875 0"} fill={"transparent"} height={"4.875px"} id={"QRgHy819f"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(10.125 9)"} width={"4.875px"} />
        <path d={"M 19.472 0.953 C 19.545 0.692 19.472 0.412 19.28 0.22 C 19.088 0.028 18.808 -0.045 18.546 0.028 L 0.546 5.486 C 0.245 5.571 0.029 5.834 0.003 6.145 C -0.023 6.457 0.147 6.752 0.429 6.886 L 8.626 10.874 L 12.614 19.07 C 12.748 19.352 13.043 19.522 13.354 19.496 C 13.666 19.47 13.929 19.253 14.013 18.953 Z"} fill={"transparent"} height={"19.498812438350562px"} id={"e4MqjlSIZ"} strokeDasharray={""} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"var(--pgex8v, 1.5)"} stroke={"var(--21h8s6, rgb(0, 0, 0))"} transform={"translate(1.499 3.001)"} width={"19.49974993835056px"} />
      </svg>
    </div>
  )
}
