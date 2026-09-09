import { ControllerEntry } from '../types';

/**
 * Official EPAM Country Controller Roster (23 Enrolled Controllers)
 * Each controller is assigned a unique, memorable code (e.g. UMUT26, ANNA26).
 * When entered, the system authenticates the user by their FIRST NAME ONLY.
 */
export const CONTROLLER_ROSTER: ControllerEntry[] = [
  { id: 'c-1', fullName: 'Umut Yasar', firstName: 'Umut', email: 'Umut_Yasar@epam.com', code: 'UMUT26' },
  { id: 'c-2', fullName: 'Aurelie Van Herck', firstName: 'Aurelie', email: 'Aurelie_Van_Herck@epam.com', code: 'AURE26' },
  { id: 'c-3', fullName: 'Premnath Kalloe', firstName: 'Premnath', email: 'Premnath_Kalloe@epam.com', code: 'PREM26' },
  { id: 'c-4', fullName: 'Tunde Resko', firstName: 'Tunde', email: 'Tunde_Resko@epam.com', code: 'TUND26' },
  { id: 'c-5', fullName: 'Katalin Gyarfasi', firstName: 'Katalin', email: 'Katalin_Gyarfasi@epam.com', code: 'KATA26' },
  { id: 'c-6', fullName: 'Anna Duszanska', firstName: 'Anna', email: 'Anna_Duszanska@epam.com', code: 'ANNA26' },
  { id: 'c-7', fullName: 'Desislava Diamandieva', firstName: 'Desislava', email: 'Desislava_Diamandieva@epam.com', code: 'DESI26' },
  { id: 'c-8', fullName: 'Frederic Desonnay', firstName: 'Frederic', email: 'Frederic_Desonnay@epam.com', code: 'FRED26' },
  { id: 'c-9', fullName: 'Laszlo Szabo', firstName: 'Laszlo', email: 'Laszlo_Szabo@epam.com', code: 'LASZ26' },
  { id: 'c-10', fullName: 'Jitka Haincova', firstName: 'Jitka', email: 'Jitka_Haincova@epam.com', code: 'JITK26' },
  { id: 'c-11', fullName: 'Melda Uz Ulku', firstName: 'Melda', email: 'Melda_Uz_Ulku@epam.com', code: 'MELD26' },
  { id: 'c-12', fullName: 'Vassilios Papadimitriou', firstName: 'Vassilios', email: 'Vassilios_Papadimitriou@epam.com', code: 'VASS26' },
  { id: 'c-13', fullName: 'Jeannette Ensslin', firstName: 'Jeannette', email: 'jeannette_ensslin@epam.com', code: 'JEAN26' },
  { id: 'c-14', fullName: 'Nicholas Gentens', firstName: 'Nicholas', email: 'nicholas_gentens@epam.com', code: 'NICH26' },
  { id: 'c-15', fullName: 'Claudette Gauci', firstName: 'Claudette', email: 'Claudette_Gauci@epam.com', code: 'CLAU26' },
  { id: 'c-16', fullName: 'Christine Ritson', firstName: 'Christine', email: 'Christine_Ritson@epam.com', code: 'CHRI26' },
  { id: 'c-17', fullName: 'Christina Rolli', firstName: 'Christina', email: 'Christina_Rolli@epam.com', code: 'CHRT26' },
  { id: 'c-18', fullName: 'Magdalena Figueroa', firstName: 'Magdalena', email: 'magdalena_figueroa@epam.com', code: 'MAGD26' },
  { id: 'c-19', fullName: 'Esmeralda Vadillo', firstName: 'Esmeralda', email: 'esmeralda_vadillo@epam.com', code: 'ESME26' },
  { id: 'c-20', fullName: 'Javier Sanchez Quintanilla', firstName: 'Javier', email: 'javier_sanchezquintanilla@epam.com', code: 'JAVI26' },
  { id: 'c-21', fullName: 'Adriana Moyano', firstName: 'Adriana', email: 'Adriana_Moyano@epam.com', code: 'ADRI26' },
  { id: 'c-22', fullName: 'Taylor Newhall', firstName: 'Taylor', email: 'Taylor_Newhall@epam.com', code: 'TAYL26' },
  { id: 'c-23', fullName: 'Maik Souza', firstName: 'Maik', email: 'Maik_Souza@epam.com', code: 'MAIK26' },
];

/**
 * Finds a controller by code, first name, full name, or email prefix.
 * Returns the controller entry if matched.
 */
export function findControllerByCodeOrName(query: string): ControllerEntry | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();

  // 1. Direct code match (e.g. "ANNA26" or "anna26")
  const byCode = CONTROLLER_ROSTER.find(c => c.code.toLowerCase() === clean);
  if (byCode) return byCode;

  // 2. Direct first name match (e.g. "Anna" or "anna")
  const byFirstName = CONTROLLER_ROSTER.find(c => c.firstName.toLowerCase() === clean);
  if (byFirstName) return byFirstName;

  // 3. Full name match (e.g. "Anna Duszanska")
  const byFullName = CONTROLLER_ROSTER.find(c => c.fullName.toLowerCase() === clean);
  if (byFullName) return byFullName;

  // 4. Email match or email username match (e.g. "Anna_Duszanska@epam.com" or "Anna_Duszanska")
  const byEmail = CONTROLLER_ROSTER.find(c => 
    c.email.toLowerCase() === clean || 
    c.email.toLowerCase().startsWith(clean)
  );
  if (byEmail) return byEmail;

  return undefined;
}
