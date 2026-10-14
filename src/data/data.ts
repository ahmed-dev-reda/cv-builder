import {
  inter,
  lato,
  merriweather,
  montserrat,
  nunito,
  openSans,
  oswald,
  playfairDisplay,
  poppins,
  roboto,
} from "@/lib/fonts";

export const fontMap: Record<
  string,
  {
    className: string;
    fontFamily: string;
  }
> = {
  inter: {
    className: inter.className,
    fontFamily: inter.style.fontFamily,
  },
  roboto: {
    className: roboto.className,
    fontFamily: roboto.style.fontFamily,
  },
  "open-sans": {
    className: openSans.className,
    fontFamily: openSans.style.fontFamily,
  },
  lato: {
    className: lato.className,
    fontFamily: lato.style.fontFamily,
  },
  montserrat: {
    className: montserrat.className,
    fontFamily: montserrat.style.fontFamily,
  },
  poppins: {
    className: poppins.className,
    fontFamily: poppins.style.fontFamily,
  },
  merriweather: {
    className: merriweather.className,
    fontFamily: merriweather.style.fontFamily,
  },
  "playfair-display": {
    className: playfairDisplay.className,
    fontFamily: playfairDisplay.style.fontFamily,
  },
  oswald: {
    className: oswald.className,
    fontFamily: oswald.style.fontFamily,
  },
  nunito: {
    className: nunito.className,
    fontFamily: nunito.style.fontFamily,
  },
  "times-new-roman": {
    className: "",
    fontFamily: '"Times New Roman", serif',
  },
};
