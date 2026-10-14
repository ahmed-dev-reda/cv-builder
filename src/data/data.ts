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
    label: string;
  }
> = {
  inter: {
    className: inter.className,
    fontFamily: inter.style.fontFamily,
    label: "Inter",
  },
  roboto: {
    className: roboto.className,
    fontFamily: roboto.style.fontFamily,
    label: "Roboto",
  },
  "open-sans": {
    className: openSans.className,
    fontFamily: openSans.style.fontFamily,
    label: "Open Sans",
  },
  lato: {
    className: lato.className,
    fontFamily: lato.style.fontFamily,
    label: "Lato",
  },
  montserrat: {
    className: montserrat.className,
    fontFamily: montserrat.style.fontFamily,
    label: "Montserrat",
  },
  poppins: {
    className: poppins.className,
    fontFamily: poppins.style.fontFamily,
    label: "Poppins",
  },
  merriweather: {
    className: merriweather.className,
    fontFamily: merriweather.style.fontFamily,
    label: "Merriweather",
  },
  "playfair-display": {
    className: playfairDisplay.className,
    fontFamily: playfairDisplay.style.fontFamily,
    label: "Playfair Display",
  },
  oswald: {
    className: oswald.className,
    fontFamily: oswald.style.fontFamily,
    label: "Oswald",
  },
  nunito: {
    className: nunito.className,
    fontFamily: nunito.style.fontFamily,
    label: "Nunito",
  },
  "times-new-roman": {
    className: "font-times-new-roman",
    fontFamily: '"Times New Roman", serif',
    label: "Times New Roman",
  },
};
