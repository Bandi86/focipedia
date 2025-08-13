import { PrismaClient, MatchStatus } from '@prisma/client';

const prisma = new PrismaClient();

type OpenFootballMatch = {
  round?: string;
  date: string; // YYYY-MM-DD
  team1: string;
  team2: string;
  score?: { ft?: [number, number] };
};

async function main() {
  const seasonName = '2025/2026';
  // Ensure season exists
  const season = await prisma.season.upsert({
    where: { name: seasonName },
    create: { name: seasonName },
    update: {},
  });

  // Try to import as many common leagues as possible for 2025-26
  const codes: string[] = [
    // England
    'en.1',
    'en.2',
    'en.3',
    'en.4',
    // Germany
    'de.1',
    'de.2',
    'de.3',
    // Spain
    'es.1',
    'es.2',
    // Italy
    'it.1',
    'it.2',
    // France
    'fr.1',
    'fr.2',
    // Portugal, Netherlands, Turkey, Belgium, Scotland
    'pt.1',
    'nl.1',
    'tr.1',
    'be.1',
    'sc.1',
    'sc.2',
    // Central/Eastern/Nordic selections
    'at.1',
    'ch.1',
    'cz.1',
    'gr.1',
    'pl.1',
    'se.1',
    'no.1',
    'dk.1',
    'fi.1',
    'hu.1',
    // International (best effort) – skipped if not present
    'europe.cl',
    'europe.el',
    'europe.ecl',
    // Domestic cups (best effort common names; skipped if not present)
    'de.dfb',
    'es.copa',
    'it.coppa',
    'fr.coupe',
    'pt.taca',
    'nl.knvb',
    'tr.cup',
    'be.cup',
    'sc.cup',
    'hu.mk',
  ];

  const countryMap: Record<string, string> = {
    en: 'England',
    de: 'Germany',
    es: 'Spain',
    it: 'Italy',
    fr: 'France',
    pt: 'Portugal',
    nl: 'Netherlands',
    tr: 'Turkey',
    be: 'Belgium',
    sc: 'Scotland',
    at: 'Austria',
    ch: 'Switzerland',
    cz: 'Czech Republic',
    gr: 'Greece',
    pl: 'Poland',
    se: 'Sweden',
    no: 'Norway',
    dk: 'Denmark',
    fi: 'Finland',
    hu: 'Hungary',
  };

  const knownLeagueNames: Record<string, string> = {
    'en.1': 'Premier League',
    'en.2': 'Championship',
    'en.3': 'League One',
    'en.4': 'League Two',
    'de.1': 'Bundesliga',
    'de.2': '2. Bundesliga',
    'de.3': '3. Liga',
    'es.1': 'Primera División',
    'es.2': 'Segunda División',
    'it.1': 'Serie A',
    'it.2': 'Serie B',
    'fr.1': 'Ligue 1',
    'fr.2': 'Ligue 2',
    'pt.1': 'Primeira Liga',
    'nl.1': 'Eredivisie',
    'tr.1': 'Süper Lig',
    'be.1': 'Pro League',
    'sc.1': 'Scottish Premiership',
    'sc.2': 'Scottish Championship',
    'at.1': 'Bundesliga (Austria)',
    'ch.1': 'Super League (Switzerland)',
    'cz.1': 'Czech First League',
    'gr.1': 'Super League Greece',
    'pl.1': 'Ekstraklasa',
    'se.1': 'Allsvenskan',
    'no.1': 'Eliteserien',
    'dk.1': 'Superliga',
    'fi.1': 'Veikkausliiga',
    'hu.1': 'NB I',
    'europe.cl': 'UEFA Champions League',
    'europe.el': 'UEFA Europa League',
    'europe.ecl': 'UEFA Europa Conference League',
    'de.dfb': 'DFB-Pokal',
    'es.copa': 'Copa del Rey',
    'it.coppa': 'Coppa Italia',
    'fr.coupe': 'Coupe de France',
    'pt.taca': 'Taça de Portugal',
    'nl.knvb': 'KNVB Beker',
    'tr.cup': 'Turkish Cup',
    'be.cup': 'Belgian Cup',
    'sc.cup': 'Scottish Cup',
    'hu.mk': 'Magyar Kupa',
  };

  for (const code of codes) {
    const url = `https://raw.githubusercontent.com/openfootball/football.json/master/2025-26/${code}.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = (await res.json()) as { name: string; matches: OpenFootballMatch[] };
      const cc = code.split('.')[0] as keyof typeof countryMap;
      const country = countryMap[cc] || 'Unknown';
      const leagueName = knownLeagueNames[code] || json.name || code;

      const existing = await prisma.league.findFirst({ where: { name: leagueName } });
      const league = existing
        ? await prisma.league.update({ where: { id: existing.id }, data: { country } })
        : await prisma.league.create({ data: { name: leagueName, country } });

      // Collect team names from matches
      const teamNameSet = new Set<string>();
      for (const m of json.matches) {
        if (m.team1) teamNameSet.add(m.team1);
        if (m.team2) teamNameSet.add(m.team2);
      }
      const teamIds: Record<string, number> = {};
      for (const name of Array.from(teamNameSet)) {
        const team = await prisma.team.upsert({
          where: { name },
          create: { name, country },
          update: { country },
        });
        teamIds[name] = team.id;
      }

      // LeagueSeason link
      const leagueSeason = await prisma.leagueSeason.upsert({
        where: { leagueId_seasonId: { leagueId: (league as any).id, seasonId: season.id } },
        create: { leagueId: (league as any).id, seasonId: season.id },
        update: {},
      });
      // Attach teams to LeagueSeason
      for (const tid of Object.values(teamIds)) {
        await prisma.teamSeason.upsert({
          where: { teamId_leagueSeasonId: { teamId: tid, leagueSeasonId: leagueSeason.id } },
          create: { teamId: tid, leagueSeasonId: leagueSeason.id },
          update: {},
        });
      }

      // Create fixtures
      for (const m of json.matches) {
        const homeId = teamIds[m.team1];
        const awayId = teamIds[m.team2];
        if (!homeId || !awayId) continue;
        const dt = new Date(m.date);
        const status: MatchStatus =
          dt.getTime() < Date.now() ? MatchStatus.Finished : MatchStatus.Scheduled;
        try {
          await prisma.match.create({
            data: {
              matchDate: dt,
              round: m.round,
              status,
              homeTeamId: homeId,
              awayTeamId: awayId,
              leagueId: (league as any).id,
              homeScore: m.score?.ft?.[0] ?? 0,
              awayScore: m.score?.ft?.[1] ?? 0,
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
