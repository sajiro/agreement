# Purpose

What is currently referred to as the Agreement Center, is migrating to live
within the MSX platform as "Agreements".
for this "lift and shift". This document serves as a way to have a
record of these considerations.

## Sideloading

The idea of sideloading is to pull our React app for AgreementCenter and
just drop it into MSX. In speaking with the MSX team, this could could
cause unnecessary packages to be loaded if MSX and Agreement Center app have different versions of NPM packages such as React, but is an acceptable
solution to get something shippable. The way sideloading works is that
MSX has their own [PCF adapter](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview)
that will be able to load our React from a
CDN. To do so, we must first create a "canvas app", essentially a blank app that's only
job will be to pull in our full React application. Our app will then need a way to know that
its instantiated within Dynamics vs Partner Center.

## Telemetry

Application Insight Azure is used on Agreement Center to track users. This
telemetry only gets logged per site. So for example, if a user
encounters an error while using the Agreement Center on MSX, the error will be sent to the MSX team.

## Authentication

We will need to grab a token for authentication and use the token to
authenticate with PartnerCenter + MSX.

## Production Navigation

In production, there is a navigation bar that gets loaded via
Reverse Proxy. We will have to make sure this reverse proxy is does not
inject its content within the MSX platform since MSX has its own nav.
