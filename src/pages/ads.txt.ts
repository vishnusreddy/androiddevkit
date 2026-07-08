import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const prerender = false;

export const GET: APIRoute = () =>
  Response.redirect(`https://srv.adstxtmanager.com/19390/${SITE.domain}`, 301);
