import type { CSSProperties } from 'react'

type PersonalDetails = { groom:string; bride:string; groomFamily?:string; brideFamily?:string; message?:string; date?:string }

// Original named-route scenes. Keep order-template fitting changes separate.
export function ReferenceOpeningScene({ groom, bride, date }: PersonalDetails) {
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
        <svg className={"d14-14zc4xz d14-entry-name"} data-d14-name={"GROOM NAME"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 504 119"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
          <text x={"50%"} y={"50%"} dominantBaseline={"central"} textAnchor={"middle"} fontFamily={"D14 Heading Serif, Georgia, serif"} fontSize={"102"} fontWeight={"700"} fill={"#ffe6b3"}>
            {groom.toUpperCase()}
          </text>
        </svg>
        <svg className={"d14-1sy4tjt d14-entry-name"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 89 38"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
          <foreignObject width={"100%"} height={"100%"} className={"d14-fit-text"} transform={"scale(1)"} style={{"overflow": "visible", "transformOrigin": "center center"} as CSSProperties}>
            <p dir={"auto"} style={{"--font-selector": "R0Y7Sm9zdC1yZWd1bGFy", "--d14-font-family": "\"Jost\", \"Jost Placeholder\", sans-serif", "--d14-font-size": "32px", "--d14-text-color": "rgb(255, 255, 255)"} as CSSProperties} className={"d14-text"}>
              {"WEDS"}
            </p>
          </foreignObject>
        </svg>
        <svg className={"d14-1xwenpz d14-entry-name"} data-d14-name={"BRIDE NAME"} data-d14-component-type={"RichTextContainer"} viewBox={"0 0 361 130"} style={{"willChange": "transform", "opacity": "0", "transform": "translate(-50%, -50%) translateY(40px)"} as CSSProperties}>
          <text x={"50%"} y={"50%"} dominantBaseline={"central"} textAnchor={"middle"} fontFamily={"D14 Heading Serif, Georgia, serif"} fontSize={"68"} fontWeight={"700"} fill={"#ffe6b3"}>
            {bride.toUpperCase()}
          </text>
        </svg>
        <svg style={{ opacity: 0 }} className={"d14-entry-date d14-entry-name"} viewBox={"0 0 361 50"} role={"img"} aria-label={weddingDate}>
          <text x={"50%"} y={"50%"} dominantBaseline={"central"} textAnchor={"middle"} fontFamily={"D14 Heading Serif, Georgia, serif"} fontSize={"34"} fontWeight={"600"} fill={"#fff0cd"}>
            {weddingDate}
          </text>
        </svg>
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

export function ReferenceWelcomeScene({ groom, bride, groomFamily, brideFamily, message }: PersonalDetails) {
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
        <p className={"d14-page-two-intro"}>
          {message || <>{'With the blessings of God and our beloved families,'}<br />{'we joyfully invite you to celebrate the wedding of'}</>}
        </p>
        <div className="d14-page-two-families">
          <h2 className="d14-page-two-names">{groom.toUpperCase()}</h2>
          <p className="d14-page-two-family">
            {groomFamily || <>Son of Sri Bhaskar Shetty P &amp; Smt. Shilpashri B. Shetty,<br />Grandson of Late Puttanna Shetty Pandubettu and Late Bhoja S. Shetty Shanarabettu.<br />Brother of Dr. Anmol B. Shetty.</>}
          </p>
          <p className="d14-page-two-family-amp">&amp;</p>
          <h2 className="d14-page-two-names">{bride.toUpperCase()}</h2>
          <p className="d14-page-two-family">
            {brideFamily || <>Daughter of Sri Sadashiva Shetty &amp; Smt. Rekha S. Shetty.<br />Granddaughter of Haradi Marbinamane Late Krishnayya Shetty, Chantharu Guddemane Late Hiriyanna Shetty.<br />Sister of Suhas Shetty &amp; Chinraj Shetty.</>}
          </p>
        </div>
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
